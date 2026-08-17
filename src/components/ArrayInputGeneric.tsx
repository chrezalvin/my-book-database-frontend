import { JSX } from "react";
import { Form } from "react-bootstrap";

export interface ArrayInputGenericProps<_T>{
	arrToJSX: (arr: _T[], triggerRemove: (ele: _T) => void) => JSX.Element;
  	getEleJSX: (triggerAdd: (ele: _T) => void) => JSX.Element;
	onArrayChange: (arr: _T[]) => void;
	pred?: (a: _T, b: _T) => boolean;

	elements: _T[];

	title: string;
	children?: JSX.Element;
}

export function ArrayInputGeneric<_T, >(props: ArrayInputGenericProps<_T>){
    function handleElementAdded(arrEle: _T){
		const found = props.elements.find(ele => props.pred?.(ele, arrEle) ?? ele === arrEle);
		if(found)
			return;

		props.onArrayChange([...props.elements, arrEle]);
    }

	function handleElementRemoved(removed: _T){
		const filtered = props.elements.filter(ele => !(props.pred?.(ele, removed) ?? ele === removed));

		props.onArrayChange(filtered);
	}

    return (
	<Form.Group className="mb-3" controlId="formNewGenreAliases">
      	<Form.Label>{props.title}</Form.Label>
		{
			props.arrToJSX(props.elements, handleElementRemoved)
		}
		{
			props.getEleJSX(handleElementAdded)
		}
		{props.children}
	</Form.Group>
    )
}

export default ArrayInputGeneric;