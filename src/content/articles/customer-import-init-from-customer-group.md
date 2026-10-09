---
title: "Customer import through the data entity does not default values from the customer group"
description: "A 2017 extension on CustCustomerEntity that calls initFromCustGroup during import, so fields like payment terms default from the customer group."
date: 2017-12-22
updated: 2026-10-10
kind: note
track: integrations
versions: ["D365FO"]
tags: ["data-entities","customers","extensions","xpp"]
verdict: to-review
verdictNote: "Written for platform update 11; check whether the current customer entity already defaults from the customer group."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2017/12/bug-importing-customers-using-data.html"
mergedFrom: []
draft: false
---

When you import customers through the customer data entity, fields that the customer form takes from the customer group, such as payment terms, stay empty. This note fixes it with an event handler on the entity.

## The original note

Importing customers with the data entity does not initialize data from the customer group: for example, payment terms are not taken from the group automatically.

This extension on the `CustCustomerEntity` data entity fixes the problem:

```xpp
[ExtensionOf(dataentityviewstr(CustCustomerEntity))]
final class CustCustomerEntity_Extension
{
    [DataEventHandler(tableStr(CustCustomerEntity), DataEventType::MappedEntityToDataSource)]
    public static void CustCustomerEntity_onMappedEntityToDataSource(Common _sender, DataEventArgs _eventArgs)
    {
        CustCustomerEntity custCustomerEntity = _sender;
        DataEntityContextEventArgs dataEntityContextEventArgs = _eventArgs;

        DataEntityDataSourceRuntimeContext _dataSourceCtx = dataEntityContextEventArgs.parmEntityDataSourceContext();
        if (_dataSourceCtx.name() == dataEntityDataSourceStr(CustCustomerEntity, CustTable))
        {
            CustTable custTable = _dataSourceCtx.getBuffer();
            custTable.initFromCustGroup(CustGroup::find(custTable.CustGroup));
        }
    }
}
```

Applies to D365FO platform update 11 (Spring 2017).

## References

- [Customize through extension and overlayering](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/extensibility/customization-overlayering-extensions) (Microsoft Learn): the list of data entity events, including `onMappedEntityToDataSource`.
