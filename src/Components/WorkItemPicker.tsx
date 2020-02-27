import * as React from "react";
import { TagPicker } from "azure-devops-ui/TagPicker";
import { useObservableArray } from "azure-devops-ui/Core/Observable";
import { ISuggestionItemProps } from "azure-devops-ui/SuggestionsList";
import SdkService from "..";
import { IRelatedWit } from "../Interfaces/IDeliveryItem";


export const WorkItemPicker: React.FunctionComponent<{}> = () => {
    const [tagItems, setTagItems] = useObservableArray<IRelatedWit>([]);
    const [suggestions, setSuggestions] = useObservableArray<IRelatedWit>([]);

    const areTagsEqual = (a: IRelatedWit, b: IRelatedWit) => {
        return a.id === b.id;
    };

    const convertItemToPill = (tag: IRelatedWit) => {
        return {
            content: `${tag.id}-${tag.title}`,
            onClick: () => alert(`Clicked tag "${tag.title}"`)
        };
    };

    const onSearchChanged = (searchValue: string) => {

        var witFound = SdkService.getWit(+searchValue);
        setSuggestions(
            [witFound]
                .filter(
                    // Items not already included
                    testItem =>
                        tagItems.value.findIndex(
                            testSuggestion => testSuggestion.id === testItem.id
                        ) === -1
                )
        );
    };

    const onTagAdded = (tag: IRelatedWit) => {
        setTagItems([...tagItems.value, tag]);
    };

    const onTagRemoved = (tag: IRelatedWit) => {
        setTagItems(tagItems.value.filter(x => x.id !== tag.id));
    };

    const renderSuggestionItem = (tag: ISuggestionItemProps<IRelatedWit>) => {
        if (tag.item)
            return <div className="body-m">{tag.item.title}</div>;
        return <div />;
    };

    return (
        <div className="flex-column">
            <TagPicker
                areTagsEqual={areTagsEqual}
                convertItemToPill={convertItemToPill}
                noResultsFoundText={"Nenhum resultado encontrado."}
                onSearchChanged={onSearchChanged}
                onTagAdded={onTagAdded}
                onTagRemoved={onTagRemoved}
                renderSuggestionItem={renderSuggestionItem}
                selectedTags={tagItems}
                suggestions={suggestions}
                suggestionsLoading={false}
            />
        </div>
    );
};