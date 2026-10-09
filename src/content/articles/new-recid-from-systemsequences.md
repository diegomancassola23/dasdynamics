---
title: "Get a new RecId in SQL for a direct insert into an AX table"
description: "A T-SQL script that reserves the next RecId of an AX table from SYSTEMSEQUENCES, for inserts made directly in the database."
date: 2014-01-03
updated: 2026-10-10
kind: note
track: platform
versions: ["AX 2009","AX 2012"]
tags: ["sql","recid","database"]
verdict: historical
verdictNote: "Direct SQL on the AX 2009/2012 database (SQLDICTIONARY, SYSTEMSEQUENCES); not a pattern for D365FO."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2014/01/sql-retrive-new-recid-for-insert-direct.html"
mergedFrom: []
draft: false
---

Inserting rows into an AX table directly in SQL needs a valid `RecId`, and the AOS hands them out from `SYSTEMSEQUENCES`. This script reserves the next one for a given table.

## The original note

The first error message in the script is in Italian, as in the original ("the @TABLENAME parameter must be specified").

```sql
DECLARE @TABLENAME nvarchar(40)
DECLARE @TABLEID int

SET @TABLENAME = 'TABLENAME'

IF (@TABLENAME = '')
BEGIN
    RAISERROR ('Il parametro @TABLENAME deve essere specificato', 16, 1);
    RETURN
END

SELECT @TABLEID = TABLEID FROM SQLDICTIONARY WHERE NAME = @TABLENAME AND FIELDID = 0
IF (ISNULL(@TABLEID, 0) = 0)
BEGIN
    RAISERROR ('The table %1.40s does not exists', 16, 1, @TABLENAME);
    RETURN
END

BEGIN TRANSACTION
DECLARE @RECID bigint = (SELECT NEXTVAL FROM SYSTEMSEQUENCES WHERE TABID = @TABLEID AND NAME = 'SEQNO')
IF (ISNULL(@RECID, 0) = 0)
BEGIN
    RAISERROR ('Unable to get new RECID for the table  %1.40s', 16, 1, @TABLENAME);
    RETURN
END

UPDATE SYSTEMSEQUENCES SET NEXTVAL = @RECID + 1 WHERE TABID = @TABLEID AND NAME = 'SEQNO'
COMMIT TRANSACTION

SELECT @RECID
```

## References

- No current Microsoft Learn page applies.
