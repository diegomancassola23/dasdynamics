# Content report

The editorial pass that turned the old blog (Dynamics AX Notes, 64 posts, 2014–2024) and the nine LinkedIn articles (2024–2026) into the content collection of Dynamics Dreams. Rewrite date: 2026-10-10. The collection is checked by `node scripts/validate-content.mjs`.

## Counts

| | Count |
|---|---|
| Sources in | 73 (64 blog posts + 9 LinkedIn articles) |
| Blog posts retired | 15 |
| Blog posts merged into another entry | 3 (the 2024 TLS post into the TLS article; one export post; one caching post) |
| Notes published | 46 |
| Articles published | 9 |
| Entries in `src/content/articles/` | 55 |

Check: 64 blog posts = 46 notes + 15 retired + 3 merged.

## Verdicts (46 notes)

| Verdict | Notes |
|---|---|
| valid | 6 |
| changed | 1 |
| historical | 18 |
| to-review | 21 |

- **valid**: `caching-display-methods`, `odata-tls12-underlying-connection-closed`, `sp-executesql-output-parameter`, `ssrs-enable-remote-errors`, `ssrs-value-only-on-last-page`, `sys-obsolete-attribute`.
- **changed**: `start-cloud-hosted-vm-powershell` (AzureRM to Az).
- **historical**: AX 2009/2012 techniques whose platform is gone (AIF, Enterprise Portal, MorphX shared projects, the model store, AX 2012 DIXF, AX 2012 CIL helpers, security keys). Each has a one-line reason in `verdictNote`.
- **to-review**: X++ snippets that use application classes and methods with no Microsoft Learn page. I could not verify them, so the notes do not claim they still work.

## to-review: what to check

Each of these needs a check on a current D365FO version, ideally a compile and a run in a development environment.

| Note | What to check |
|---|---|
| `export-data-entity-xpp` | `DMFEntityExporter.exportToFile`, `DMFPackageExporter::exportToFileV2`, `DMFDefinitionGroupExecution::serviceInsertOrDisplay` (parameter list), `DataImportFramework::MoveToStaging`. The documented alternative from outside the system is the package REST API (`ExportToPackage`), linked in the note. The January snippet mixes `VendVendorV2Entity` with a `BankPositivePayExportEntity` data source, as in the original. |
| `customer-import-init-from-customer-group` | Whether the current customer data entity already applies the customer group defaults, and whether the handler is still needed. |
| `last-error-from-infolog` | `infolog.copy` and the container layout of infolog lines (type at position 1, text at 2). |
| `product-color-name-by-color-id` | `EcoResColor::findByName`, `EcoResProductDimensionAttribute::inventDimFieldId2DimensionAttributeRecId`, `EcoResProductMasterDimValueTranslation::findByProductMasterDimValLanguage`. |
| `check-field-mapping-on-table-map` | `Global::mappingExists` signature and behavior. |
| `merge-ledger-and-default-dimensions` | `DimensionDefaultingService::serviceCreateLedgerDimension` in D365FO and its recommended replacement. I found no Learn page for either, so the note claims nothing about a replacement. |
| `save-ssrs-report-to-excel-xpp` | `SRSPrintMediumType::File` and `SRSReportFileFormat::Excel` with `SrsReportRunController`, and where the file ends up in the cloud. |
| `electronic-address-locators-by-role` | `DirParty::electronicAddressLocatorsByRole` signature. |
| `infolog-message-open-record` | `SysInfoAction_TableField::newBuffer` in the web client message center. |
| `create-transfer-order-xpp` | `InventTransferLine.initFromInventTransferTable`, `InventTransferLine::lastLineNum`, quantities set directly on the line. |
| `query-date-range-sysquery` | `SysQuery::range` with `dateNull()` as an open bound. |
| `refresh-display-options-clear-display-option` | `FormDataSource.clearDisplayOption`. |
| `create-counting-journal-xpp` | `InventSumDatePhysicalDim::onHandQty`, `journalSetCounted`, the voucher logic. The original contains an inline "try replacing..." suggestion; kept and labelled. |
| `recalculate-inventsum-item` | `InventSumRecalcItem`, and whether the on-hand consistency check is the supported route today. |
| `inventsum-closed-and-closedqty` | The meaning of `Closed` and `ClosedQty`, and when inventory close sets them. |
| `enumerator-not-valid-element-cil` | Map and Set enumerator behavior after a remove in D365FO. |
| `find-product-variant-by-dimensions` | `EcoResProductVariantDimValue::getDimensionValuesContainer`, `EcoResProductVariantExistMgr::findVariantByMasterAndDimensions`. The original line has an extra closing parenthesis; kept. |
| `find-product-master-by-number` | `EcoResProduct::findByProductNumber` and its return type (the snippet assigns it to an `EcoResProductMaster`). |
| `inventory-dimension-active-check` | `InventDimGroupSetup::newInventTable`, `getFieldSetup`, `getStorageDimensionGroup`, and whether `WMSPalletId` is still an inventory dimension. The original line ends with an extra `));`; kept. |
| `multi-selection-helper` | `MultiSelectionHelper::construct`, `parmDatasource`, `getFirst`/`getNext`. The original loop tests a different variable; kept and labelled. |
| `save-and-restore-infolog` | `infolog.infologData()`, `infolog.import`, `infolog.view`. The original uses an undeclared `x`; kept and labelled. |

## Retired posts (15)

Retired means the post is not republished. Each one is in the table below with its reason.

- **Reposts and link-only posts (10)**: explicit "reposted from" (B12, B15, B26, B37, B55), link-only (B13, B16, B39, B51), and a third-party list shared as is (B10).
- **Attributed copies (4)**: content copied from another author's blog with thanks or "found here" (B31, B32, B38, B40). My own contribution was one line at most.
- **Non-technical (1)**: the MVP congratulations post (B47).

The brief expected about 9 retirements. The count is 15 because I also retired the four attributed copies and the third-party list: republishing them as my notes on a personal site would present other people's work as mine.

## Merges

- `ssl-tls-secure-channel-error-dotnet` (LinkedIn, March 2024) absorbs the February 2024 blog post on the same AX 2012 TLS error; the article is the longer version. The blog URL is in `mergedFrom`.
- `export-data-entity-xpp` joins the two 2021 posts on exporting a data entity from X++. The February URL is `originalUrl`; the January one is in `mergedFrom`.
- `caching-display-methods` joins the 2014 "how to" and the 2016 "pay attention" posts. The 2016 URL is `originalUrl`; the 2014 one is in `mergedFrom`.

## Decisions Diego should know

1. **Person name in an article.** `extending-copilot-chat-d365fo` thanks a named community member, verbatim from LinkedIn. That conflicts with "no person names in pages". I kept it because articles are verbatim; decide whether to drop the name.
2. **Articles: formatting only, with a few fixes.** I removed emojis and hashtag lines, unwrapped LinkedIn redirect links, turned bold-only lines into headings, added code languages, restored the line breaks lost in the PowerShell and C# code, turned prose that sat inside code blocks (cloud-hosted article) back into prose, and wrote alt text for the images. The TLS article's duplicated section numbers (2, 2, ..., 7, 7) became 1 to 9. LinkedIn cover images were skipped (no schema field).
3. **Article titles.** "D356FO" became "D365FO" in the code review title; the integration parts read "(Part 1 of 2)" and "(Part 2 of 2)"; "For" became "for" in the multithreading title.
4. **Article links fixed.** Part 2's "link to part #1" pointed to the Copilot Chat article; it now points to `/articles/integration-architecture-rest-apim-part-1/`. In the code review article, the "inspired by" link showed a GitHub repository but pointed to the Marketplace; the link now matches the text. The GitHub link in Part 2 now uses https.
5. **Articles left as published.** The code review article ends mid-sentence ("...scenarios,") as on LinkedIn. The multithreading sample misses a closing brace in the original. Both kept.
6. **Notes: code kept as published.** I fixed indentation, Markdown escapes and Blogger formatting only. Where the original has a bug (stray quote, extra parenthesis, undeclared variable, mismatched loop variable), I kept it and, where it matters, said so above the code. Italian messages inside code stay in Italian, with a line saying so. Typographic quotes in one snippet (`find-product-variant-by-dimensions`) became plain quotes.
7. **Customer-like identifiers replaced.** Two snippets used project-specific object names with a customer-style prefix (`find-projects-containing-aot-object`, `query-date-range-sysquery`). I replaced them with `MyClass` and `MyTable` and said so in the note.
8. **Download link not republished.** `ax2009-inventsum-modified-fields` linked an XPO on a personal Google Drive. I dropped the link (it carries a file ID) and said so in the note.
9. **Images.** No blog images were downloaded. The Role Center screenshots (`ax2012-custom-role-center-page`) only repeat the numbered steps, and the SSRS parameter screenshot (`ssrs-parameter-overrides-contract-default`) belongs to a third-party blog.
10. **Then → now links.** Added only where Diego already wrote the modern counterpart: label translation to `automating-label-creation-xpp`; AIF, DIXF, the OData client error and data export to `integration-architecture-rest-apim-part-1`; the TLS 1.2 OData note to `ssl-tls-secure-channel-error-dotnet`.
11. **Possibly unattributed copies kept.** These read like text taken from elsewhere without credit, but I could not prove it, so they stay as notes: `ax2012-delete-label-files`, `ax2012-turn-off-synchronize-database-form`, `inventsum-closed-and-closedqty`, `create-counting-journal-xpp`, and the five snippets published together on 2014-01-03 (`find-product-variant-by-dimensions`, `find-product-master-by-number`, `inventory-dimension-active-check`, `multi-selection-helper`, `save-and-restore-infolog`). Retire them if Diego recognizes the source.
12. **Dead original links kept as references.** MSDN, TechNet and old community links stay in "References", marked "original link"; many no longer resolve. Every Microsoft Learn link in the notes was opened and read on 2026-10-09.
13. **No "In D365FO today" claims beyond Learn.** Every sentence in those sections quotes or closely paraphrases the linked Learn page. An overlayering claim considered during planning was dropped: the Learn page on extensions and overlayering does not say overlayering is unsupported.
14. **`versions` values.** Used "AX 4.0", "AX 2009", "AX 2012" and "D365FO". "AX 4.0" appears once (`find-projects-containing-aot-object`), from the original labels.
15. **Note titles.** Rewritten as plain descriptive titles; "HOWTO:", "TIP:", "CODE:", "ISSUE:" and "D365FFO:" prefixes were dropped. Where an original title promised more than the note delivers (enums in `query-date-range-sysquery`, "in body" in `ssrs-value-only-on-last-page`), the lead says so.

## New articles from LinkedIn short posts (drafts)

Four native articles expand short LinkedIn posts (rows P0, P10, P11, P14 of `sources/linkedin-posts/posts.md`). They have no `originalUrl` and are `draft: true` until Diego reviews them. Every Learn link was opened and read on 2026-10-09.

| Article | Where Learn changed or did not confirm the post |
|---|---|
| `isv-licenses-sha256-10-0-49` | Confirmed: SHA-1 removal in build 7.0.8129.0 (PU73 = 10.0.49), SignatureVersion 2. Learn also has an older deprecation entry (10.0.39/PU63); the article says so. The auto-update hold for affected environments is not on Learn: kept as a field observation. |
| `continuous-number-sequences-10-0-47` | Build 7.0.7858.76, the 7.0.7858.90 fix and its root cause come from the support case. Learn confirms continuity rules (Italian tax books), cleanup, pause policy, and that 10.0.47 PQU-3 (7.0.7858.96) follows the fix build. |
| `missing-inventsum-records-by-design` | Issue 914302 and "since 10.0.40" come from the support case. Learn confirms the mechanism, the parameter, its location and the affected reports. |
| `fno-power-platform-admin-center` | Changed per Learn: up to 80 AOS (not 10); USE has JIT write via `db_datawriter` (not read-only); production can also be provisioned directly; admin user management is in public preview and covers admins only. Not confirmed: "ISV via AppSource only", F&O-specific environment group rules, "preview regions" (the article shows Learn's region table instead). |

## Source URL table

All 73 sources. L = LinkedIn article (order of `sources/linkedin/index.json`), B = blog post (index in `sources/blogger/posts.json`).

| # | Date | Original URL | Result |
|---|---|---|---|
| L1 | 2026-07-10 | https://www.linkedin.com/pulse/d365fo-integration-architecture-real-world-approach-rest-mancassola-1hulf/ | article `integration-architecture-rest-apim-part-2` |
| L2 | 2026-05-22 | https://www.linkedin.com/pulse/extending-copilot-chat-d365fo-what-worked-didnt-i-diego-mancassola-pmnif/ | article `extending-copilot-chat-d365fo` |
| L3 | 2026-04-30 | https://www.linkedin.com/pulse/d365fo-integration-architecture-real-world-approach-rest-mancassola-gqbzf/ | article `integration-architecture-rest-apim-part-1` |
| L4 | 2026-03-18 | https://www.linkedin.com/pulse/d356fo-copilot-code-review-diego-mancassola-aoynf/ | article `d365fo-copilot-code-review` |
| L5 | 2026-02-17 | https://www.linkedin.com/pulse/virtual-zpl-printer-d365fo-diego-mancassola-ldw4f/ | article `virtual-zpl-printer-d365fo` |
| L6 | 2026-01-31 | https://www.linkedin.com/pulse/automating-label-creation-x-d365fo-diego-mancassola-j5d3f/ | article `automating-label-creation-xpp` |
| L7 | 2024-03-20 | https://www.linkedin.com/pulse/overcoming-incomplete-status-cloud-hosted-dynamics-365-mancassola-2anbf/ | article `cloud-hosted-incomplete-winrm-certificate` |
| L8 | 2024-03-10 | https://www.linkedin.com/pulse/resolving-ssltls-secure-channel-error-net-diego-mancassola-awksf/ | article `ssl-tls-secure-channel-error-dotnet` |
| L9 | 2024-02-29 | https://www.linkedin.com/pulse/multithreading-d365fo-diego-mancassola-j4s8e/ | article `multithreading-d365fo` |
| B00 | 2024-02-26 | https://dynamicsaxnotes.blogspot.com/2024/02/ax-2012-request-was-aborted-could-not.html | merged into `ssl-tls-secure-channel-error-dotnet` |
| B01 | 2021-02-02 | https://dynamicsaxnotes.blogspot.com/2021/02/d365ffo-export-data-entity-by-code-x.html | note `export-data-entity-xpp` |
| B02 | 2021-01-27 | https://dynamicsaxnotes.blogspot.com/2021/01/d365ffo-start-virtual-machine-cloud.html | note `start-cloud-hosted-vm-powershell` |
| B03 | 2021-01-22 | https://dynamicsaxnotes.blogspot.com/2021/01/d365ffo-export-data-entity-by-code-x.html | merged into `export-data-entity-xpp` |
| B04 | 2018-01-05 | https://dynamicsaxnotes.blogspot.com/2018/01/d365ffo-systeminvalidoperationexception.html | note `odata-client-enum-key-property-error` |
| B05 | 2018-01-04 | https://dynamicsaxnotes.blogspot.com/2018/01/d365ffo-underlying-connection-was.html | note `odata-tls12-underlying-connection-closed` |
| B06 | 2017-12-22 | https://dynamicsaxnotes.blogspot.com/2017/12/bug-importing-customers-using-data.html | note `customer-import-init-from-customer-group` |
| B07 | 2017-07-20 | https://dynamicsaxnotes.blogspot.com/2017/07/ax2012-force-role-center-page-to-your.html | note `ax2012-custom-role-center-page` |
| B08 | 2017-01-05 | https://dynamicsaxnotes.blogspot.com/2017/01/howto-run-batch-using-x-helps-for-debug.html | note `ax2012-debug-batch-in-cil` |
| B09 | 2016-06-28 | https://dynamicsaxnotes.blogspot.com/2016/06/tip-pay-attention-when-use-caching.html | note `caching-display-methods` |
| B10 | 2016-06-09 | https://dynamicsaxnotes.blogspot.com/2016/06/info-dynamics-ax-2009-file-extensions.html | retired: repost of third-party information on AX 2009 file extensions |
| B11 | 2016-05-26 | https://dynamicsaxnotes.blogspot.com/2016/05/howto-debug-aifoutboundprocessingservice.html | note `ax2012-debug-aif-outbound-processing` |
| B12 | 2016-05-26 | https://dynamicsaxnotes.blogspot.com/2016/05/howto-create-computed-columns-in-views.html | retired: explicit repost from another blog (computed columns) |
| B13 | 2016-05-04 | https://dynamicsaxnotes.blogspot.com/2016/05/new-training-material-on-dlp-get-ready.html | retired: link-only post (training link) |
| B14 | 2016-04-19 | https://dynamicsaxnotes.blogspot.com/2016/04/x-how-to-find-what-projects-object-from.html | note `find-projects-containing-aot-object` |
| B15 | 2016-04-19 | https://dynamicsaxnotes.blogspot.com/2016/04/tip-error-executing-code-field-with-id.html | retired: explicit repost from a community blog |
| B16 | 2016-04-12 | https://dynamicsaxnotes.blogspot.com/2016/04/ax7-how-to-connect-microsoft-dynamics.html | retired: link-only post (third-party TFS article) |
| B17 | 2016-04-08 | https://dynamicsaxnotes.blogspot.com/2016/04/howto-delete-label-files-from-ax-2012.html | note `ax2012-delete-label-files` |
| B18 | 2016-03-11 | https://dynamicsaxnotes.blogspot.com/2016/03/field-entity-must-be-filled-in-on-dixf.html | note `ax2012-dixf-entity-must-be-filled-in` |
| B19 | 2016-03-07 | https://dynamicsaxnotes.blogspot.com/2016/03/code-check-security-key-via-x-ax2009.html | note `ax2009-check-security-key` |
| B20 | 2016-02-22 | https://dynamicsaxnotes.blogspot.com/2016/02/howto-set-translation-of-label-on-fly.html | note `ax-label-translation-by-code` |
| B21 | 2016-02-12 | https://dynamicsaxnotes.blogspot.com/2016/02/howto-get-error-details-from-infolog-by.html | note `last-error-from-infolog` |
| B22 | 2016-02-01 | https://dynamicsaxnotes.blogspot.com/2016/02/howto-update-purchqty-of-purchline.html | note `ax2009-update-purchase-line-quantity` |
| B23 | 2015-11-20 | https://dynamicsaxnotes.blogspot.com/2015/11/x-find-shared-project-by-name.html | note `find-shared-project-by-name` |
| B24 | 2015-11-11 | https://dynamicsaxnotes.blogspot.com/2015/11/howto-turning-off-synchronize-database.html | note `ax2012-turn-off-synchronize-database-form` |
| B25 | 2015-10-01 | https://dynamicsaxnotes.blogspot.com/2015/10/2009-inventsum-dont-update.html | note `ax2009-inventsum-modified-fields` |
| B26 | 2015-06-30 | https://dynamicsaxnotes.blogspot.com/2015/06/howto-detecting-default-values.html | retired: repost from another blog (detecting default values) |
| B27 | 2015-06-05 | https://dynamicsaxnotes.blogspot.com/2015/06/howto-get-ecorescolor-name-by.html | note `product-color-name-by-color-id` |
| B28 | 2015-05-04 | https://dynamicsaxnotes.blogspot.com/2015/05/howto-check-is-field-is-mapped-to-field.html | note `check-field-mapping-on-table-map` |
| B29 | 2015-04-07 | https://dynamicsaxnotes.blogspot.com/2015/04/ax-2012-merge-ledger-and-financial.html | note `merge-ledger-and-default-dimensions` |
| B30 | 2015-04-07 | https://dynamicsaxnotes.blogspot.com/2015/04/today-i-found-strange-error-in.html | note `ax2012-view-shown-as-table-in-aot` |
| B31 | 2015-03-30 | https://dynamicsaxnotes.blogspot.com/2015/03/howto-preview-parts-and-surrogate-keys.html | retired: content copied from another blog, with thanks |
| B32 | 2015-03-24 | https://dynamicsaxnotes.blogspot.com/2015/03/issue-ssrs-metdataexception-exception.html | retired: body copied from another blog; only one line of my own |
| B33 | 2015-03-19 | https://dynamicsaxnotes.blogspot.com/2015/03/howto-enable-remote-errors-on-ssrs.html | note `ssrs-enable-remote-errors` |
| B34 | 2015-03-17 | https://dynamicsaxnotes.blogspot.com/2015/03/howto-dixf-how-to-regenerate-target.html | note `ax2012-dixf-regenerate-target-mapping` |
| B35 | 2014-11-19 | https://dynamicsaxnotes.blogspot.com/2014/11/howto-save-ssrs-report-to-excel-from-x.html | note `save-ssrs-report-to-excel-xpp` |
| B36 | 2014-11-14 | https://dynamicsaxnotes.blogspot.com/2014/11/howto-retrive-list-of-locator-of.html | note `electronic-address-locators-by-role` |
| B37 | 2014-11-14 | https://dynamicsaxnotes.blogspot.com/2014/11/howto-dynamics-ax-custom-lookup.html | retired: explicit repost from another blog (custom lookup) |
| B38 | 2014-11-04 | https://dynamicsaxnotes.blogspot.com/2014/11/guide-steps-to-correctly-approach-to.html | retired: repost of a colleague's post |
| B39 | 2014-10-16 | https://dynamicsaxnotes.blogspot.com/2014/10/guide-ax-2012-net-assembly-deployment.html | retired: link-only post (.NET assembly deployment) |
| B40 | 2014-10-14 | https://dynamicsaxnotes.blogspot.com/2014/10/howto-create-invent-marking.html | retired: code taken from a community blog |
| B41 | 2014-10-09 | https://dynamicsaxnotes.blogspot.com/2014/10/tip-automatic-open-entity-when-double.html | note `infolog-message-open-record` |
| B42 | 2014-10-09 | https://dynamicsaxnotes.blogspot.com/2014/10/howto-create-transfer-order-by-code-x.html | note `create-transfer-order-xpp` |
| B43 | 2014-10-02 | https://dynamicsaxnotes.blogspot.com/2014/10/ssrs-show-value-only-on-last-page-in.html | note `ssrs-value-only-on-last-page` |
| B44 | 2014-10-01 | https://dynamicsaxnotes.blogspot.com/2014/10/ax-2012-how-to-use-date-range-and-enum.html | note `query-date-range-sysquery` |
| B45 | 2014-09-19 | https://dynamicsaxnotes.blogspot.com/2014/09/the-report-parameters-are-overridden-by.html | note `ssrs-parameter-overrides-contract-default` |
| B46 | 2014-09-18 | https://dynamicsaxnotes.blogspot.com/2014/09/if-you-modify-report-on-2012-versione.html | note `ax2012-restart-ssrs-after-rdp-change` |
| B47 | 2014-04-17 | https://dynamicsaxnotes.blogspot.com/2014/04/congratulations-to-denis-macchinetti.html | retired: non-technical (MVP congratulations) |
| B48 | 2014-04-17 | https://dynamicsaxnotes.blogspot.com/2014/04/howto-refresh-display-options-at-run.html | note `refresh-display-options-clear-display-option` |
| B49 | 2014-01-29 | https://dynamicsaxnotes.blogspot.com/2014/01/howto-caching-display-methods.html | merged into `caching-display-methods` |
| B50 | 2014-01-24 | https://dynamicsaxnotes.blogspot.com/2014/01/howto-create-counting-journal.html | note `create-counting-journal-xpp` |
| B51 | 2014-01-21 | https://dynamicsaxnotes.blogspot.com/2014/01/fix-how-to-fix-to-using-sysemailbatch.html | retired: link-only post (SysEmailBatch) |
| B52 | 2014-01-13 | https://dynamicsaxnotes.blogspot.com/2014/01/recalculate-inventsum.html | note `recalculate-inventsum-item` |
| B53 | 2014-01-13 | https://dynamicsaxnotes.blogspot.com/2014/01/closed-and-closedqty-in-inventsum-table.html | note `inventsum-closed-and-closedqty` |
| B54 | 2014-01-13 | https://dynamicsaxnotes.blogspot.com/2014/01/the-enumerator-does-not-designate-valid.html | note `enumerator-not-valid-element-cil` |
| B55 | 2014-01-11 | https://dynamicsaxnotes.blogspot.com/2014/01/howto-finding-user-sessions-from-spid.html | retired: explicit repost from an MSDN blog |
| B56 | 2014-01-03 | https://dynamicsaxnotes.blogspot.com/2014/01/sql-taking-result-from-dynamics.html | note `sp-executesql-output-parameter` |
| B57 | 2014-01-03 | https://dynamicsaxnotes.blogspot.com/2014/01/sql-retrive-new-recid-for-insert-direct.html | note `new-recid-from-systemsequences` |
| B58 | 2014-01-03 | https://dynamicsaxnotes.blogspot.com/2014/01/tip-using-of-sysobsoleteattribute.html | note `sys-obsolete-attribute` |
| B59 | 2014-01-03 | https://dynamicsaxnotes.blogspot.com/2014/01/howto-find-reference-for-product.html | note `find-product-variant-by-dimensions` |
| B60 | 2014-01-03 | https://dynamicsaxnotes.blogspot.com/2014/01/howto-find-product-master-record-by.html | note `find-product-master-by-number` |
| B61 | 2014-01-03 | https://dynamicsaxnotes.blogspot.com/2014/01/howto-determine-whether-dimension-for.html | note `inventory-dimension-active-check` |
| B62 | 2014-01-03 | https://dynamicsaxnotes.blogspot.com/2014/01/howto-multiselectionhelper.html | note `multi-selection-helper` |
| B63 | 2014-01-03 | https://dynamicsaxnotes.blogspot.com/2014/01/howto-save-and-restore-infolog.html | note `save-and-restore-infolog` |
