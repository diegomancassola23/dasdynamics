---
title: "Export a data entity from X++ with the data management framework"
description: "Two X++ sketches that export a data entity to a file through the data management framework, using a definition group or DMFEntityExporter."
date: 2021-02-02
updated: 2026-10-10
kind: note
track: integrations
versions: ["D365FO"]
tags: ["data-management","data-entities","export","xpp"]
verdict: to-review
verdictNote: "DMFEntityExporter, exportToFileV2 and the related DMF classes are internal and not documented on Learn; check them on a current version."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2021/02/d365ffo-export-data-entity-by-code-x.html"
mergedFrom: ["https://dynamicsaxnotes.blogspot.com/2021/01/d365ffo-export-data-entity-by-code-x.html"]
draft: false
---

Sometimes you need to export a data entity from code instead of from the Data management workspace: a scheduled job, a button, a file to hand to the user. These two notes from early 2021 show two ways to do it in X++ with the data management framework (DMF): one through an existing definition group, one directly through `DMFEntityExporter`.

Then → now: for exports driven from outside the system, see my integration series, starting with [D365FO Integration Architecture, Part 1](/articles/integration-architecture-rest-apim-part-1/).

## The original note

### Export through a definition group (February 2021)

A simple way to export a data entity using the data management framework.

You need a definition group (data project) where the entity is mapped and all parameters are set. This script gives you an output file. You can set the push method or not: in my case I needed an option to force a full push when an entity is mapped with incremental push.

The snippet is shown as published; it is a sketch with placeholders (`...`).

```xpp
DMFDefinitionGroupName definitionGroupName;
DMFEntityName entityName;
DMFSourceName sourceName;
DMFExecutionId executionid = "..."; //Your unique execution identifier
DMFDefinitionGroup definitionGroup = DMFDefinitionGroup::find(definitionGroupName, true);

DMFEntityExporter exporter = new DMFEntityExporter();
Description description = "..."

DMFDefinitionGroupEntity definitionGroupEntity = DMFDefinitionGroupEntity::find(
    definitionGroupName",
    entityName,
    true);

DMFDefinitionGroupExecution::serviceInsertOrDisplay(definitionGroup,
    executionid,
    definitionGroupEntity.Entity,
    definitionGroupEntity.SampleFilePath,
    definitionGroup.Description,
    '',
    '',
    '',
    NoYes::Yes,
    DMFFileType::File,
    1,
    '',
    false,
    curExt());

DMFDefinitionGroupExecution definitionGroupExecution = DMFDefinitionGroupExecution::find(
    definitionGroupName,
    entityName,
    executionid,
    true);

ttsBegin;
definitionGroupExecution.selectForUpdate(true);
definitionGroupExecution.ExecuteTargetStep = NoYes::Yes;
if (...) //Full push condition
{
    definitionGroupExecution.DefaultRefreshType = DMFRefreshType::FullPush;
}
definitionGroupExecution.Update();
ttsCommit;

DataImportFramework::MoveToStaging(executionid);

SharedServiceUnitFileID fileId = DMFPackageExporter::exportToFileV2(
    definitionGroupName,
    executionid,
    entityName,
    sourceName);
```

### Export with DMFEntityExporter and send the file to the user (January 2021)

This is the code for exporting a data entity with X++.

Note: the export runs as a batch job. Keep that in mind if you use it where performance matters.

```xpp
try
{
    EntityName entityName = DMFEntity::findFirstByTableId(tableNum(VendVendorV2Entity)).EntityName;

    Query query = new Query(DMFUtil::getDefaultQueryForEntity(entityName));
    QueryBuildDataSource qbds = query.dataSourceTable(tableNum(BankPositivePayExportEntity));

    DMFEntityExporter exporter = new DMFEntityExporter();

    fileId = exporter.exportToFile(entityName,
        definitionGroupName,
        '', //Optional: ExecutionID
        "CSV", //Optional::SourceName
        #FieldGroupName_AllFields, //Optional field selection
        query.pack(), //Optional: Filtered Query
        curExt() //Optional: DataAReaId
        );

    if (fileId != '')
    {
        str downloadUrl = DMFDataPopulation::getAzureBlobReadUrl(str2Guid(fileId));

        Filename filename = strFmt('export.csv');
        System.IO.Stream stream = File::UseFileFromURL(downloadUrl);
        File::SendFileToUser(stream, filename);
    }
    else
    {
        throw error("DMF execution failed and details were written to the execution log");
    }
}
catch
{
    error("error occurred while exporting");
}
```

## References

- [Data management package REST API](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/data-entities/data-management-api) (Microsoft Learn): the documented way to export a data project from outside the system (`ExportToPackage`, `GetExportedPackageUrl`).
