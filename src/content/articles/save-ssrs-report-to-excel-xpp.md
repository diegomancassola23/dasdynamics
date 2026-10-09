---
title: "Save an SSRS report to Excel from X++"
description: "Run an SSRS report from X++ without the dialog and write it to an Excel file, for example to store it or send it by e-mail."
date: 2014-11-19
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012"]
tags: ["ssrs","reporting","excel","print-settings"]
verdict: to-review
verdictNote: "Written for AX 2012; check the file print destination and the Excel format on a current D365FO version."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2014/11/howto-save-ssrs-report-to-excel-from-x.html"
mergedFrom: []
draft: false
---

You often need a report as a file rather than on screen: to archive it or to attach it to an e-mail. This snippet runs a report from X++ with the print settings set to an Excel file.

## The original note

Here is an example that saves a report in Excel format:

```xpp
SrsReportRunController          controller = new SrsReportRunController();
ReportContract   contract = new ReportContract();

controller.parmReportName(ssrsReportStr(ReportName, Report));

controller.parmShowDialog(false);
controller.parmReportContract().parmPrintSettings().printMediumType(SRSPrintMediumType::File);
controller.parmReportContract().parmPrintSettings().fileFormat(SRSReportFileFormat::Excel);
controller.parmReportContract().parmPrintSettings().overwriteFile(true);
controller.parmReportContract().parmPrintSettings().fileName(fileName);

controller.parmReportContract().parmRdpContract(contract);
contract.parmXYZ(_parmXYZValue);

controller.startOperation();
```

## References

- [Create and modify reports that use SSRS](https://learn.microsoft.com/en-us/training/modules/build-reports-finance-operations/01-ssrs-reports) (Microsoft Learn training): SSRS reports in finance and operations apps can print "to different locations, such as your screen, a printer, a file, or an email".
