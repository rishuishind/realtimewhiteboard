import { TbRectangle } from "react-icons/tb";
import { IoMdDownload } from "react-icons/io";
import { FaLongArrowAltRight } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { GiArrowCursor } from "react-icons/gi";
import { FaRegCircle } from "react-icons/fa6";
import {
  Arrow,
  Circle,
  Layer,
  Line,
  Rect,
  Stage,
} from "react-konva";
import {useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ACTIONS } from "../constants"


const Roompage = () => {
    const stageRef= useRef<any>(null);
    const [action, setAction] = useState<string>(ACTIONS.SELECT)
    const [fillColor,setFillColor] = useState<string>("#ff0000");

    const [rectangles,setRectangles] = useState<any[]>([]);
    const [circles,setCircles] = useState<any[]>([]);
    const [arrows,setArrows] = useState<any[]>([]);
    const [scribbles,setScribbles]=useState<any[]>([]);
    const [allElements,setAllElements] = useState<any[]>([]);
    const [history,setHistory] = useState<any[]>([]);

    const isDraggable:boolean = action===ACTIONS.SELECT;

    const isPainting = useRef<boolean>(false);
    const currentShapeId:uuidv4 = useRef<string>();

    const strokeColor = '#000000';

    const onPointerUp=()=>{
        isPainting.current=false;
    }
    const onPointerDown=()=>{
        if(action===ACTIONS.SELECT) return;
        const stage = stageRef.current;
        const {x,y} = stage.getPointerPosition();
        const id = uuidv4();

        currentShapeId.current = id;
        isPainting.current = true;
        switch (action) {
            case ACTIONS.RECTANGLE:
                setRectangles((rectangle)=>[...rectangle,{id,x,y,height:20,width:20,fillColor,}]);
                setAllElements((prev)=>[...prev,rectangles]);
                break;
            case ACTIONS.CIRCLE:
                setCircles((circle)=>[...circle,{id,x,y,radius:20,fillColor}]);
                setAllElements((prev)=>[...prev,circles]);
                break;
            case ACTIONS.ARROW:
                setArrows((arrow)=>[...arrow,{id,points:[x,y,x+20,y+(-20)],fillColor}]);
                setAllElements((prev)=>[...prev,arrows]);
                break;
            case ACTIONS.SCRIBBLE:
                setScribbles((scribble)=>[...scribble,{id,points:[x,y],fillColor}]);
                setAllElements((prev)=>[...prev,scribbles]);
                break;
            default:
                break;
        }
    }
    const onPointerMove=()=>{
        if(action===ACTIONS.SELECT || !isPainting.current) return;
        const stage = stageRef.current;
        const {x,y} = stage?.getPointerPosition() || {x: 0, y: 0};
        isPainting.current = true;
        switch (action) {
            case ACTIONS.RECTANGLE:
                setRectangles((rectangles)=>
                rectangles.map((rectangle)=>{
                    if(rectangle.id===currentShapeId.current){
                        return {
                            ...rectangle,
                            width:x-rectangle.x,
                            height:y-rectangle.y,
                        }
                    }return rectangle
                }))
                break;
            case ACTIONS.CIRCLE:
                setCircles((circles)=>
                circles.map((circle)=>{
                    if(circle.id===currentShapeId.current){
                        return{
                            ...circle,
                            radius:((y-circle.y)**2 +(x-circle.x)**2)**0.5
                        }
                    }return circle
                })
                )
                break;
            case ACTIONS.ARROW:
                setArrows((arrows)=>
                arrows.map((arrow)=>{
                    if(arrow.id===currentShapeId.current){
                        return {...arrow,points:[arrow.points[0],arrow.points[1],x,y]}
                    }
                    return arrow
                })
                )
                break;
            case ACTIONS.SCRIBBLE:
                setScribbles((scribbles)=>
                scribbles.map((scribble)=>{
                    if(scribble.id===currentShapeId.current){
                        return{...scribble,points:[...scribble.points,x,y]}
                    }return scribble
                })
                )
                break;
            default:
                break;
        }
    }

    const handleClearCanvas=()=>{
        setRectangles([]);
        setCircles([]);
        setArrows([]);
        setScribbles([]);
    }
    const handleUndo=()=>{
        setHistory((prev)=>[...prev,allElements[allElements.length-1]]);
        switch (action) {
            case ACTIONS.RECTANGLE:
                setRectangles((prev)=>prev.slice(0,prev.length-1));
                break;
            case ACTIONS.CIRCLE:
                setCircles((prev)=>prev.slice(0,prev.length-1));
                break;
            case ACTIONS.ARROW:
                setArrows((prev)=>prev.slice(0,prev.length-1));
                break;
            case ACTIONS.SCRIBBLE:
                setScribbles((prev)=>prev.slice(0,prev.length-1));
                break;
            default:
                break;
        }
    }
    const handleRedo=()=>{
        switch (action) {
            case ACTIONS.RECTANGLE:
                setRectangles((prev)=>[...prev,history[history.length-1]]);
                setHistory((prev)=>prev.slice(0,history.length-1));
                break;
            case ACTIONS.CIRCLE:
                setCircles((prev)=>[...prev,history[history.length-1]]);
                setHistory((prev)=>prev.slice(0,history.length-1));
                break;
            case ACTIONS.ARROW:
                setArrows((prev)=>[...prev,history[history.length-1]]);
                setHistory((prev)=>prev.slice(0,history.length-1));
                break;
            case ACTIONS.SCRIBBLE:
                setScribbles((prev)=>[...prev,history[history.length-1]]);
                setHistory((prev)=>prev.slice(0,history.length-1));
                break;
            default:
                break;
        }
    }

    const handleDownload=()=>{
        const uri = stageRef.current.toDataURL();
        const link = document.createElement("a");
        link.download = "image.png";
        link.href=uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className=" relative w-full h-screen overflow-hidden">
            <div className="flex justify-center py-3">
                <div className="flex gap-4  border-2 py-2 px-3 shadow-lg">
                    <button className={`text-2xl p-1 rounded ${action===ACTIONS.SELECT ? ' bg-violet-300': 'hover:bg-violet-200'}`} onClick={()=>{setAction(ACTIONS.SELECT)}} >
                        <GiArrowCursor/>
                    </button>
                    <button className={`text-2xl p-1 rounded ${action===ACTIONS.RECTANGLE ? ' bg-violet-300': 'hover:bg-violet-200'}`} onClick={()=>{setAction(ACTIONS.RECTANGLE)}}>
                        <TbRectangle/>
                    </button>
                    <button className={`text-2xl p-1 rounded ${action===ACTIONS.CIRCLE ? ' bg-violet-300': 'hover:bg-violet-200'}`} onClick={()=>{setAction(ACTIONS.CIRCLE)}}>
                        <FaRegCircle/>
                    </button>
                    <button className={`text-2xl p-1 rounded ${action===ACTIONS.ARROW ? ' bg-violet-300': 'hover:bg-violet-200'}`} onClick={()=>{setAction(ACTIONS.ARROW)}}>
                        <FaLongArrowAltRight/>
                    </button>
                    <button className={`text-2xl p-1 rounded ${action===ACTIONS.SCRIBBLE ? ' bg-violet-300': 'hover:bg-violet-200'}`} onClick={()=>{setAction(ACTIONS.SCRIBBLE)}}>
                        <LuPencil/>
                    </button>
                    <input className="hover:cursor-pointer" type="color" name="color" value={fillColor} onChange={(e)=>setFillColor(e.target.value)} />
                    <button className="text-2xl hover:bg-violet-200 p-1 hover:rounded" onClick={handleDownload}>
                        <IoMdDownload/>
                    </button>
                </div>
                <div className="flex ml-10 mr-20">
                    <button onClick={handleUndo} disabled={allElements.length===0} className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-bold mr-3">Undo</button>
                    <button onClick={handleRedo} disabled={history.length<1} className="px-3 py-2 border-2 rounded font-bold hover:bg-blue-200 border-blue-600 text-blue-600">Redo</button>
                </div>
                <button className="ml-10 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold" onClick={handleClearCanvas}>Clear Canvas</button>
            </div>
            <Stage className="border-2 border-black" ref={stageRef} width={window.innerWidth} height={window.innerHeight} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerMove={onPointerMove}>
                <Layer>
                    <Rect
                    x={0}
                    y={0}
                    width={window.innerWidth}
                    height={window.innerHeight}
                    fill="#ffffff"
                    id="bg"
                    />
                    {rectangles.map((rectangle)=>(<Rect key={rectangle.id} x={rectangle.x} y={rectangle.y} stroke={strokeColor} strokeWidth={2} fill={rectangle.fillColor} height={rectangle.height} width={rectangle.width} draggable={isDraggable}/>))}
                    {circles.map((circle)=>(<Circle key={circle.id} x={circle.x} y={circle.y} stroke={strokeColor} strokeWidth={2} fill={circle.fillColor} radius={circle.radius} draggable={isDraggable}/>))}
                    {arrows.map((arrow)=>(<Arrow key={arrow.id} points={arrow.points} stroke={fillColor} strokeWidth={2} fill={arrow.fillColor} draggable={isDraggable}/>))}
                    {scribbles.map((scribble)=>(<Line key={scribble.id} lineCap="round" lineJoin="round" points={scribble.points} stroke={fillColor} strokeWidth={2} fill={scribble.fillColor} draggable={isDraggable} />))}
                </Layer>
            </Stage>
        </div>
    );
}

export default Roompage;
