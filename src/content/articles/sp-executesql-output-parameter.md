---
title: "Get a value back from a dynamic sp_executesql query"
description: "Return a value from a dynamic T-SQL statement through an OUTPUT parameter of sp_executesql."
date: 2014-01-03
updated: 2026-10-10
kind: note
track: platform
versions: ["AX 2012"]
tags: ["sql","t-sql","dynamic-sql"]
verdict: valid
verdictNote: "Plain T-SQL: OUTPUT parameters of sp_executesql are still documented and work the same way."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2014/01/sql-taking-result-from-dynamics.html"
mergedFrom: []
draft: false
---

A dynamic query built as a string runs in its own scope, so its variables are not visible to the caller. To get a value back, declare an `OUTPUT` parameter.

## In D365FO today

This is SQL Server, not D365FO. `sp_executesql` still supports output parameters declared with `OUTPUT` in the parameter definition, and Learn has an equivalent example ([sp_executesql (Transact-SQL)](https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-executesql-transact-sql)). Learn also warns that runtime-compiled statements can expose applications to SQL injection, so parameterize them.

## The original note

```sql
DECLARE @SQLString nvarchar(500);
DECLARE @ParmDefinition nvarchar(500);
DECLARE @CountSQLQuery varchar(30);

SET @SQLString = N'SELECT @result = COUNT(*) FROM INFORMATION_SCHEMA.TABLES';
SET @ParmDefinition = N'@result varchar(30) OUTPUT';

EXECUTE sp_executesql @SQLString, @ParmDefinition, @result=@CountSQLQuery OUTPUT;

SELECT CAST(@CountSQLQuery as int);
```

## References

- [sp_executesql (Transact-SQL)](https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-executesql-transact-sql) (Microsoft Learn)
