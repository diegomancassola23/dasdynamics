---
title: "Unlocking Performance Excellence in Dynamics 365 for Finance and Operations with Multithreading"
description: "A multithreading pattern in X++ using runAsync and System.Threading.Tasks to create sales lines in parallel, with transaction caveats."
date: 2024-02-29
kind: article
track: xpp
versions: ["D365FO"]
tags: ["performance","multithreading","async","xpp"]
originalUrl: "https://www.linkedin.com/pulse/multithreading-d365fo-diego-mancassola-j4s8e/"
mergedFrom: []
draft: false
---

In the realm of enterprise resource planning (ERP), Dynamics 365 For Finance and Operations stands out as a beacon of efficiency and adaptability. However, like any sophisticated system, the performance ceiling is often dictated by the developer's ingenuity in leveraging its underlying capabilities. One such capability that remains underutilized is multithreading. Through careful implementation, multithreading can significantly enhance the performance of specific operations, bringing forth a level of optimization that not only accelerates processes but also refines the overall user experience.

In this article, we'll explore the judicious use of multithreading in the development for Dynamics 365 For Finance and Operations. Drawing on personal experience and practical examples, we will dissect the x++ scripts that have been instrumental in achieving remarkable performance gains. Whether you are a seasoned Dynamics professional or an avid enthusiast of ERP systems, this deep dive into multithreading promises to impart valuable insights into pushing the boundaries of what is possible within the Dynamics ecosystem.

## The Scenario: Bulk Order Processing

Consider a scenario where a system is tasked with generating thousands of sales lines to form complete orders. Traditionally, this operation might be processed sequentially, which, while straightforward, leads to increased cumulative processing time. By adopting a multithreading approach, we can partition this task into several threads, allowing multiple sales lines to be created simultaneously, thereby reducing the overall time taken to complete the order creation.

## The pattern

Just made these two class:

- SalesOrdersCreateLineASyncInterface

```xpp
public interface SalesOrdersCreateLineASyncInterface
{
    /// <summary>
    /// Creates and runs as an asynchronous task.
    /// </summary>
    /// <returns>The created asynchronous task.</returns>
    public System.Threading.Tasks.Task runAsync()
    {
    }
}
```

- SalesOrdersCreateLineTask

```xpp
public class SalesOrdersCreateLineTask implements SalesOrdersCreateLineASyncInterface
{
    public container parms;

    public static SalesOrdersCreateLineTask newParameters(
        container _parms)
    {
        SalesOrdersCreateLineTask createSalesTask = SalesOrdersCreateLineTask::construct();
        createSalesTask.parms = _parms;
        return createSalesTask;
    }

    public static SalesOrdersCreateLineTask construct()
    {
        return new SalesOrdersCreateLineTask();
    }

    public System.Threading.Tasks.Task runAsync()
    {
        System.Threading.Tasks.Task threadTask = runAsync(
            classNum(SalesOrdersCreateLineTask),
            staticMethodStr(SalesOrdersCreateLineTask, runOperationAsync),
            parms);

        return threadTask;
    }

    private static container runOperationAsync(container _params, System.Threading.CancellationToken _cancellationToken)
    {

        container ret = [false, 0];
        try
        {
            ttsbegin;

            SalesId salesId;
            container parms;
            [salesId, parms] = _params;

            SalesTable salesTable = SalesTable::find(salesId);

            /*Create sales line*/
            //SalesLine salesLine =

            ttscommit;

            ret = [true, salesLine.RecId];
        }
        catch (Exception::Deadlock)
        {
            // retry on deadlock
            retry;
        }
        catch (Exception::UpdateConflict)
        {
            // try to resolve update conflict
            if (appl.ttsLevel() == 0)
            {
                if (xSession::currentRetryCount() >= #RetryNum)
                {
                    throw Exception::UpdateConflictNotRecovered;
                }
                else
                {
                    retry;
                }
            }
            else
            {
                throw Exception::UpdateConflict;
            }
        }
        catch(Exception::DuplicateKeyException)
        {
            // retry in case of an duplicate key conflict
            if (appl.ttsLevel() == 0)
            {
                if (xSession::currentRetryCount() >= #RetryNum)
                {
                    throw Exception::DuplicateKeyExceptionNotRecovered;
                }
                else
                {
                    retry;
                }
            }
            else
            {
                throw Exception::DuplicateKeyException;
            }
        }
        return ret;
    }
}
```

Analize now how to call that pattern

```xpp
List taskList = new List(Types::Class);

//Sampling, replace with you logic
while (queryRun.next())
{
     container parms = [itemId, salesQty, ...)];

     //Add new task
     taskList.addEnd(SalesOrdersCreateLineTask::newParameters([salesId, parms]));
}

//Determine task lenght
int taskListLength = taskList.elements();
System.Threading.Tasks.Task[] threadTasklist = new System.Threading.Tasks.Task[taskListLength]();

//Start threads
int i;
ListEnumerator tasksEnumerator = taskList.getEnumerator();
while (tasksEnumerator.moveNext())
{
	SalesOrdersCreateLineASyncInterface asyncRunnableTask = tasksEnumerator.current() as SalesOrdersCreateLineASyncInterface;
	if (asyncRunnableTask)
	{
		threadTasklist.SetValue(asyncRunnableTask.runAsync(), i);
		i++;
	}
}

int connectionKeepAlivePingIntervalInMilliSec = 15*60*1000;
while (!System.Threading.Tasks.Task::WaitAll(threadTasklist, connectionKeepAlivePingIntervalInMilliSec))
{
     sleep(500); //Waiting pool time
}

//Analizye results
for (i = 0; i < threadTasklist.Get_Length(); i++)
{
	boolean taskSucceed = false;
	System.Threading.Tasks.Task task = threadTasklist.GetValue(i);
	AsyncTaskResult taskResult = AsyncTaskResult::getAsyncTaskResult(task);

	System.Exception exception = taskResult.getException();
	taskSucceed = (exception == null);

	if (!taskSucceed)
	{
                //Analyze and report exception
                throw error("Sales line creation failed")
        }
        else
        {
                container result = taskResult.getResult();
                boolean createLineResult;
                RecId salesLineRecId;
                [createLineResult, salesLineRecId] = result;
        }
```

## Best Practices in Multithreading with X++

Employing a multithreading approach to sales line creation in Dynamics 365 for Finance and Operations can yield substantial performance improvements. However, to fully reap the benefits while mitigating risks, certain best practices must be diligently followed:

1. **Understand the Workload:** Before implementing multithreading, analyze the workload to determine if the tasks are CPU-bound or I/O-bound. This understanding will guide how to structure the threads for maximum efficiency.
2. **Error Handling:** Implement comprehensive error handling within each thread. Unhandled exceptions in a thread can lead to an unstable state within the application.
3. **Test Thoroughly:** Multithreaded applications must be rigorously tested, not only for correctness but also for concurrency issues like deadlocks and race conditions. Use tools that simulate high-load scenarios to ensure that the application behaves as expected.
4. **Thread Pooling:** Consider using a thread pool to limit the number of threads that can run simultaneously. This avoids the overhead of creating and destroying threads and can lead to better performance.

## Database Transactions and Multithreading: A Critical Consideration

When leveraging the power of multithreading in Dynamics 365 for Finance and Operations, especially within the context of creating sales lines, it's imperative to understand the constraints imposed by database transactions. Transactions in X++ are managed using the Transaction Tracking System (TTS), which is not thread-safe and cannot span across multiple threads.

### Why TTS Does Not Work with Multithreading

The TTS in Dynamics 365 is designed to ensure data integrity by treating a set of database changes as a single unit of work. This means that either all changes within a transaction are committed, or none are, preserving the consistency of the database. However, TTS operates under the assumption that these changes are made sequentially in a single thread. When multiple threads attempt to use TTS, the following issues arise:

- **Isolation Violation:** Transactions are meant to be isolated from each other. Multithreading inherently introduces concurrency, which can break isolation and lead to unpredictable results.
- **Resource Locking:** TTS relies on locking mechanisms to maintain data integrity. Concurrent threads can easily lead to deadlocks or long waiting periods due to lock contention, undermining the performance benefits of multithreading.
- **Atomicity Compromise:** The atomic nature of transactions means they should either complete entirely or not at all. With multithreading, ensuring that multiple threads adhere to this principle becomes complex and error-prone.
- **Commit Coordination:** Coordinating commits and rollbacks across threads can become unwieldy, as a failure in one thread could necessitate rolling back transactions in others, leading to a tangled web of dependencies.

### Best Practice: Avoid TTS in Multithreaded Operations

For these reasons, it is best practice to avoid using TTS when employing a multithreading approach in X++. Instead, each thread should perform operations that are independent and do not require transactional control provided by TTS. If a group of operations still needs to be treated as a transaction, they should be encapsulated within a single thread or managed using alternative methods that do not rely on TTS.

### Handling Data Consistency Without TTS

To maintain data consistency without TTS, consider the following strategies:

- **Compensating Methods:** Implement compensating methods to reverse the effects of an operation if a subsequent operation fails, essentially providing a manual rollback mechanism.
- **Data Validation:** Ensure thorough data validation before operations begin to minimize the likelihood of errors that would typically require a transaction rollback.

By carefully designing your multithreaded operations with these considerations in mind, you can achieve the desired performance improvements while maintaining data integrity and consistency, even in the absence of traditional transactional control.

## Conclusion: Embracing Efficiency in Dynamics 365

In conclusion, multithreading in Dynamics 365 for Finance and Operations is a nuanced technique that, when applied correctly, can significantly enhance the efficiency of operations such as sales line creation. While the approach requires a deep understanding of both the Dynamics 365 environment and the principles of concurrent programming, the rewards in terms of performance are well worth the investment.

Through sharing this journey and providing insights into the practical application of multithreading with X++ scripts, I hope to have illuminated a path forward for like-minded professionals striving for excellence in their Dynamics 365 development endeavors.

As we continue to push the boundaries of what is possible within the Dynamics 365 framework, let us commit to a practice of continuous learning, meticulous implementation, and a forward-thinking mindset that embraces the power of modern computing to solve traditional business challenges.
