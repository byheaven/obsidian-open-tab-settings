import { browser } from '@wdio/globals'
import workspacePage from 'test/pageobjects/workspace.page';
import { obsidianPage } from 'wdio-obsidian-service';

describe("Mod click", function() {
    before(async function() {
        if ((await obsidianPage.getPlatform()).isMobile) this.skip();
    })
    beforeEach(async function() {
        await workspacePage.loadPlatformWorkspaceLayout("empty");
        await workspacePage.setSettings({
            openInNewTab: true, previewTabs: false,
            deduplicateTabs: true, deduplicateAcrossTabGroups: true,
            newTabPlacement: "after-active", newTabTabGroupPlacement: "same",
            modClickBehavior: "tab",
        });
        await workspacePage.setConfig("focusNewTab", true);
    });

    it('Test mod click same', async function() {
        await workspacePage.setSettings({ modClickBehavior: "same" });
        await workspacePage.openFile("A.md");
        await (await workspacePage.getLink("B")).click({"button": "middle"});

        await workspacePage.matchWorkspace([[
            {type: "markdown", file: "B.md", active: true},
        ]]);

        // regular click still opens in new tab
        await (await workspacePage.getLink("A")).click();

        await workspacePage.matchWorkspace([[
            {type: "markdown", file: "B.md"},
            {type: "markdown", file: "A.md", active: true},
        ]]);
    });

    it('Test mod click tab', async function() {
        await workspacePage.setSettings({ modClickBehavior: "tab" });
        await workspacePage.setConfig("focusNewTab", false);
        await workspacePage.openFile("A.md");
        await (await workspacePage.getLink("B")).click({"button": "middle"});

        await workspacePage.matchWorkspace([[
            {type: "markdown", file: "A.md", active: true},
            {type: "markdown", file: "B.md"}, // opens unfocused
        ]]);
    });

    it('Test mod click allow_duplicate', async function() {
        await workspacePage.setSettings({ deduplicateTabs: true, modClickBehavior: "allow_duplicate" });

        await workspacePage.openFile("B.md");
        await workspacePage.openFile("A.md");
        await (await workspacePage.getLink("B")).click({"button": "middle"});
        await workspacePage.matchWorkspace([[
            {type: "markdown", file: "B.md"},
            {type: "markdown", file: "A.md"},
            {type: "markdown", file: "B.md", active: true},
        ]]);
    });

    it("mod click opposite", async function() {
        if ((await obsidianPage.getPlatform()).isMobile) this.skip();
        await workspacePage.setSettings({
            openInNewTab: true, deduplicateTabs: false, modClickBehavior: "opposite",
        });

        await workspacePage.openFile("A.md");
        await workspacePage.openLinkToRight(await workspacePage.getLink("B"));
        await workspacePage.setActiveFile("A.md");

        await (await workspacePage.getLink("B")).click({"button": "middle"});
        await workspacePage.matchWorkspace([
            [{type: "markdown", file: "A.md"}],
            [{type: "markdown", file: "B.md"}, {type: "markdown", file: "B.md"}]
        ]);
    })

    it("mod click no_preview", async function() {
        await workspacePage.setSettings({ openInNewTab: true, previewTabs: true, deduplicateTabs: false });

        await workspacePage.setSettings({ modClickBehavior: "no_preview" });
        await workspacePage.openFile("A.md");
        await (await workspacePage.getLink("B")).click({"button": "middle"});
        await workspacePage.matchWorkspace([[
            {type: "markdown", file: "A.md", isPreview: false},
            {type: "markdown", file: "B.md", active: true, isPreview: false},
        ]]);
    })

    it("mod click place_after_active", async function() {
        await workspacePage.setSettings({ newTabPlacement: "end", modClickBehavior: "place_after_active" });
        await workspacePage.openFile("A.md");
        await workspacePage.openFile("D.md");
        await workspacePage.setActiveFile("A.md");
        await (await workspacePage.getLink("B")).click({"button": "middle"});
        await workspacePage.matchWorkspace([[
            {type: "markdown", file: "A.md"},
            {type: "markdown", file: "B.md", active: true},
            {type: "markdown", file: "D.md"},
        ]]);
    })

    it("mod click place_at_beginning", async function() {
        await workspacePage.setSettings({ newTabPlacement: "after-active", modClickBehavior: "place_at_beginning" });
        await workspacePage.openFile("A.md");
        await workspacePage.openFile("D.md");
        await workspacePage.setActiveFile("A.md");
        await (await workspacePage.getLink("B")).click({"button": "middle"});
        await workspacePage.matchWorkspace([[
            {type: "markdown", file: "B.md", active: true},
            {type: "markdown", file: "A.md"},
            {type: "markdown", file: "D.md"},
        ]]);
    })

    it("mod click place_at_end", async function() {
        await workspacePage.setSettings({ newTabPlacement: "after-active", modClickBehavior: "place_at_end" });
        await workspacePage.openFile("A.md");
        await workspacePage.openFile("D.md");
        await workspacePage.setActiveFile("A.md");
        await (await workspacePage.getLink("B")).click({"button": "middle"});
        await workspacePage.matchWorkspace([[
            {type: "markdown", file: "A.md"},
            {type: "markdown", file: "D.md"},
            {type: "markdown", file: "B.md", active: true},
        ]]);
    })
})
