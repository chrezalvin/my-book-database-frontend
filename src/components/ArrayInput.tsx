import { JSX, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

export interface ArrayInputProps{
	arrToJSX: (arr: string[], triggerRemove?: (keyword: string) => void) => JSX.Element;
	onArrayChange: (arr: string[]) => void;

	elements: string[];

	title: string;
	children?: JSX.Element;
}

export function ArrayInput(props: ArrayInputProps){
    const [keyword, setKeyword] = useState<string>("");

    function handleElementAdded(str: string){
		if(str === "")
			return;

		const found = props.elements.find(ele => ele === str);
		if(found)
			return;

		props.onArrayChange([...props.elements, str]);
		setKeyword("");
    }

	function handleElementRemoved(keyword: string){
		const filtered = props.elements.filter(ele => ele !== keyword);

		props.onArrayChange(filtered);
	}

    return (
		<Form.Group className="mb-3" controlId="formNewGenreAliases">
            <Form.Label>{props.title}</Form.Label>
			{
				props.arrToJSX(props.elements, handleElementRemoved)
			}
            <InputGroup>
              <Form.Control
                as="input"
                name="newKeyword"
                placeholder="Add keyword"
                value={keyword}
                onChange={(e) => {setKeyword(e.target.value)}}
                onKeyDown={(e) => {
                  if(e.key === "Enter")
                    handleElementAdded(keyword);
                }}
              />
              <Button 
                onClick={() => handleElementAdded(keyword)}
              >Add</Button>
            </InputGroup>
            {props.children}
		</Form.Group>
    )
}

export default ArrayInput;