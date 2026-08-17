import { JSX, useEffect, useState } from "react";
import { Form, InputGroup, ListGroup, Spinner } from "react-bootstrap"

export interface SearchBarProps<_T>{
    search: (keyword: string) => Promise<_T[]>
    element: (item: _T) => JSX.Element;
    onElementClick: (item: _T) => void;

    debouncingTimeMs?: number;
    placeholder?: string;
    children?: JSX.Element;
}

export function SearchBar<_T,>(props: SearchBarProps<_T>){
    const [keyword, setKeyword] = useState<string>("");
    const [currentList, setCurrentList] = useState<_T[] | null>(null);

    const [isShowingResult, setIsShowingResult] = useState<boolean>(false);

    // used to load when first time
    const [firstTimeFlag, setFirstTimeFlag] = useState<boolean>(true);

    async function search(keyword: string): Promise<void>{
        try{
            // don't search at first
            if(firstTimeFlag){
                setFirstTimeFlag(false);
                return;
            }

            setCurrentList(null);
            const res: _T[] = await props.search(keyword);
            setCurrentList(res);
        }
        catch(err){

        }
    }

    function onClickHandler(item: _T): void{
        props.onElementClick(item);
        setCurrentList([]);
        setKeyword("");
        setIsShowingResult(false)
    }

    // debouncing for search keyword
    useEffect(() => {
        const handler = setTimeout(() => {
            search(keyword);
        }, props.debouncingTimeMs ?? 500)

        return () => clearTimeout(handler);
    }, [keyword])

    return (
        <>
            <InputGroup className="mb-3">
                <Form.Control
                    placeholder={props.placeholder ?? "Search..."}
                    value={keyword}
                    onChange={(e) => {setKeyword(e.target.value)}}
                    onFocus={() => setIsShowingResult(true)}
                />

                {props.children}
            </InputGroup>
            <ListGroup 
                hidden={!isShowingResult}
                style={{maxHeight: "200px"}}
                className="overflow-y-scroll"
            >
                {
                    currentList ?
                    currentList.map((value) => (
                        <ListGroup.Item 
                            action
                            type="button"
                            // key={value.key} 
                            onClick={() => onClickHandler(value)}
                        >
                            {props.element(value)}
                        </ListGroup.Item>
                    )) :
                    (
                        <Spinner />
                    )
                }
            </ListGroup>
        </>
    )
}