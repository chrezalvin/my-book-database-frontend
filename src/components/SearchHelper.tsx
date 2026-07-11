import { useEffect, useState } from "react";
import { Button, Form, InputGroup, ListGroup, Spinner } from "react-bootstrap";

export interface SearchHelperListItem<_T> {
    item: _T;
    key: string;
    value: string;
}

export interface SearchHelperButtonSetting<_T>{
    canAddFromKeyword: (keyword: string) => boolean;
    onButtonClick: (keyword: string) => Promise<_T>;
    buttonText?: string;
}

export interface SearchHelperProps<_T> {
    show?: boolean;
    placeholder?: string;
    onHelperSelect: (item: _T) => void;

    searchByKeyword: (keyword: string) => Promise<_T[]>;
    convertToListItem: (item: _T) => SearchHelperListItem<_T>;
    buttonSetting?: SearchHelperButtonSetting<_T>;

    debounceTime?: number;
}

export default function SearchHelper<_T,>(props: SearchHelperProps<_T>) {
    const [keyword, setKeyword] = useState<string>("");
    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    const [isButtonWaiting, setIsButtonWaiting] = useState<boolean>(false);
    const [currentList, setCurrentList] = useState<SearchHelperListItem<_T>[]>([]);

    const isButtonAvailable = props.buttonSetting !== undefined && currentList.length === 0 && keyword.length > 0 && props.buttonSetting.canAddFromKeyword(keyword);

    async function search(keyword: string) {
        try{
            setIsWaiting(true);
            const result = await props.searchByKeyword(keyword);
            setCurrentList(result.map(props.convertToListItem));
        }
        catch(err){

        }
        finally{
            setIsWaiting(false);
        }
    }

    async function handleButtonClick() {
        try{
            setIsButtonWaiting(true);
            const item = await props.buttonSetting!.onButtonClick(keyword);
            props.onHelperSelect(item);
            setKeyword("");
        }
        catch(err){

        }
        finally{
            setIsButtonWaiting(false);
        }
    }

    // basic debouncing for search
    useEffect(() => {
        setIsWaiting(true);
        const handler = setTimeout(() => {
            search(keyword);
        }, props.debounceTime ?? 500);

        return () => clearTimeout(handler);
    }, [keyword]);

    // search with empty keyword on show -> true
    useEffect(() => {
        if(props.show){
            search("");
        }
    }, [props.show]);

    return (
        <div
            className={props.show ? "" : "d-none"}
            style={{ maxWidth: "300px", overflowY: "auto" }}
        >
            <InputGroup className="mb-3">
                <Form.Control
                    placeholder={props.placeholder ?? "Search..."}
                    value={keyword}
                    onChange={(e) => {setKeyword(e.target.value)}}
                    disabled={isButtonWaiting}
                />
                {(isWaiting || isButtonWaiting) && (
                    <InputGroup.Text>
                      <Spinner animation="border" size="sm" variant="secondary" />
                    </InputGroup.Text>
                )}
                {
                    isButtonAvailable && (
                        <Button 
                            type="button"
                            variant="outline-secondary" 
                            id="button-addon2"
                            onClick={() => {handleButtonClick()}}
                            disabled={isWaiting}
                        >
                            {props.buttonSetting!.buttonText ?? "Action"}
                        </Button>
                    )
                }
            </InputGroup>
            {
                (!isWaiting) && (
                    <ListGroup>
                        {currentList.map((value) => (
                            <ListGroup.Item 
                                action
                                type="button"
                                key={value.key} 
                                onClick={() => {props.onHelperSelect(value.item); setKeyword("");}}
                            >
                                {value.value}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )
            }
        </div>
    )
}