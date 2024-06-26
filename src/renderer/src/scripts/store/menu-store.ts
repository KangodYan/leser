import { SourceGroup } from "@renderer/schema-types";
import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { RSSSource } from "../models/source";
import { feedActions } from "./feed-store";
import { groupActions } from "./group-store";
import { pageActions } from "./page-store";

type MenuStore = {
    actions: {
        selectSourceGroup: (group: SourceGroup, menuKey: string) => void;
        allArticles: (init?: boolean) => void;
        selectSource: (source: RSSSource) => void;
        updateGroupExpansion: (event: React.MouseEvent, key: string, selected: string) => void;
    }
}

const useMenuStore = create<MenuStore>()(devtools(set => ({
    actions: {
        selectSourceGroup: (group: SourceGroup, menuKey: string) => {
            pageActions.selectSources(group.sids, menuKey, group.name);
            feedActions.initFeeds();
        },
        allArticles: (init = false) => {
            pageActions.selectAllArticles(init);
            feedActions.initFeeds();
        },
        selectSource: (source: RSSSource) => {
            pageActions.selectSources([source.sid], "s-" + source.sid, source.name);
            feedActions.initFeeds();
        },
        updateGroupExpansion: (event: React.MouseEvent, key: string, selected: string) => {
            if ((event.target as HTMLElement).tagName === "I" || key === selected) {
                let [type, index] = key.split("-");
                if (type === "g") {
                    groupActions.toggleGroupExpansion(parseInt(index));
                }
            }
        },
    }
}), { name: "menu" }))

export const useMenuActions = () => useMenuStore(state => state.actions);
