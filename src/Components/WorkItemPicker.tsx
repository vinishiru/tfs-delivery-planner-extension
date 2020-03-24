import * as React from "react";
import { TagPicker } from "azure-devops-ui/TagPicker";
import { useObservableArray } from "azure-devops-ui/Core/Observable";
import { ISuggestionItemProps } from "azure-devops-ui/SuggestionsList";
import SdkService from "..";
import { IRelatedWit } from "../Interfaces/IDeliveryItem";


interface IWorkItemPickerProps {
    relatedWits: IRelatedWit[];
    updateRelatedWits: (relatedWits: IRelatedWit[]) => void;
}

export const WorkItemPicker: React.FunctionComponent<IWorkItemPickerProps> = (props: IWorkItemPickerProps) => {
    const [tagItems, setTagItems] = useObservableArray<IRelatedWit>(props.relatedWits);
    const [suggestions, setSuggestions] = useObservableArray<IRelatedWit>([]);

    React.useEffect(() => {
        setTagItems(props.relatedWits);
    });

    const areTagsEqual = (a: IRelatedWit, b: IRelatedWit) => {
        return a.id === b.id;
    };

    const convertItemToPill = (tag: IRelatedWit) => {
        return {
            content: `${tag.id}-${tag.title}`
            //onClick: () => alert(`Clicked tag "${tag.title}"`)
        };
    };

    const onSearchChanged = (searchValue: string) => {

        var witFound = SdkService.getWit(+searchValue);
        if (witFound)
            setSuggestions([witFound]);
        else
            setSuggestions([]);
    };

    const onTagAdded = (tag: IRelatedWit) => {
        setTagItems([...tagItems.value, tag]);
        props.updateRelatedWits(tagItems.value);
    };

    const onTagRemoved = (tag: IRelatedWit) => {
        setTagItems(tagItems.value.filter(x => x.id !== tag.id));
        props.updateRelatedWits(tagItems.value);
    };

    const renderSuggestionItem = (tag: ISuggestionItemProps<IRelatedWit>) => {
        if (tag.item)
            return <div className="body-m">{tag.item.id}-{tag.item.title}</div>;
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