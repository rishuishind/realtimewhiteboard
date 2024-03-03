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
import {useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ACTIONS } from "../constants"
import { useDispatch, useSelector } from "react-redux";
import { storeType } from "../store";
import { Socket } from "socket.io-client";
import { userActions } from "../store/UserSlice";
import { initialUserType } from "../store/UserSlice";

interface Props{
  socket:Socket
}
interface EveryType{
  id:string,
  x?:number,
  y?:number,
  points?:[number,number,number?,number?],
  height?:number,
  width?:number,
  radius?:number,
  fillColor:string,
  type:string,
}

const Roompage:React.FC<Props> = ({socket}) => {
    const stageRef= useRef<any>(null);
    const [action, setAction] = useState<string>(ACTIONS.SELECT)
    const [fillColor,setFillColor] = useState<string>("#ff0000");

    const [rectangles,setRectangles] = useState<EveryType[]>([]);
    const [circles,setCircles] = useState<EveryType[]>([]);
    const [arrows,setArrows] = useState<EveryType[]>([]);
    const [scribbles,setScribbles]=useState<EveryType[]>([]);
    const [allElements,setAllElements] = useState<EveryType[]>([]);
    const [history,setHistory] = useState<EveryType[]>([]);
    const [img,setImg] = useState();

    const isDraggable:boolean = action===ACTIONS.SELECT;

    const dispatch = useDispatch();

    const isPainting = useRef<boolean>(false);
    const currentShapeId = useRef<string>();

    const user = useSelector((state:storeType)=>state.user);

    const strokeColor = '#000000';

  const onPointerUp = () => {
    isPainting.current = false;
  };
  const onPointerDown = () => {
    if (action === ACTIONS.SELECT) return;
    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    const id = uuidv4();

    currentShapeId.current = id;
    isPainting.current = true;
    switch (action) {
      case ACTIONS.RECTANGLE:
        setAllElements((elements) => [...elements, { id, x, y, height: 20, width: 20, fillColor, type: ACTIONS.RECTANGLE }]);
        setRectangles((rect)=>[...rect, { id, x, y, height: 20, width: 20, fillColor, type: ACTIONS.RECTANGLE }]);
        break;
      case ACTIONS.CIRCLE:
        setAllElements((elements) => [...elements, { id, x, y, radius: 20, fillColor, type: ACTIONS.CIRCLE }]);
        setCircles((circle)=>[...circle,{ id, x, y, radius: 20, fillColor, type: ACTIONS.CIRCLE }]);
        break;
      case ACTIONS.ARROW:
        setAllElements((elements) => [...elements, { id, points: [x, y, x + 20, y + (-20)], fillColor, type: ACTIONS.ARROW }]);
        setArrows((arrow)=>[...arrow,{ id, points: [x, y, x + 20, y + (-20)], fillColor, type: ACTIONS.ARROW }]);
        break;
      case ACTIONS.SCRIBBLE:
        setAllElements((elements) => [...elements, { id, points: [x, y], fillColor, type: ACTIONS.SCRIBBLE }]);
        setScribbles((scribble)=>[...scribble,{ id, points: [x, y], fillColor, type: ACTIONS.SCRIBBLE }])
        break;
      default:
        break;
    }
    const canvasImg = stage.toDataURL();
    socket.emit("whiteboardData",canvasImg);
  };
  const onPointerMove = () => {
    if (action === ACTIONS.SELECT || !isPainting.current) return;
    const stage = stageRef.current;
    const { x, y } = stage?.getPointerPosition() || { x: 0, y: 0 };
    isPainting.current = true;
    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles((rectangles) =>
          rectangles.map((rectangle) => {
            if (rectangle.id === currentShapeId.current) {
              return {
                ...rectangle,
                width: x - rectangle.x,
                height: y - rectangle.y,
              };
            }
            return rectangle;
          })
        );
        break;
      case ACTIONS.CIRCLE:
        setCircles((circles) =>
          circles.map((circle) => {
            if (circle.id === currentShapeId.current) {
              return {
                ...circle,
                radius: ((y - circle.y) ** 2 + (x - circle.x) ** 2) ** 0.5,
              };
            }
            return circle;
          })
        );
        break;
      case ACTIONS.ARROW:
        setArrows((arrows) =>
          arrows.map((arrow) => {
            if (arrow.id === currentShapeId.current) {
              return { ...arrow, points: [arrow.points[0], arrow.points[1], x, y] };
            }
            return arrow;
          })
        );
        break;
      case ACTIONS.SCRIBBLE:
        setScribbles((scribbles) =>
          scribbles.map((scribble) => {
            if (scribble.id === currentShapeId.current) {
              return { ...scribble, points: [...scribble.points, x, y] };
            }
            return scribble;
          })
        );
        break;
      default:
        break;
    }
    const canvasImg = stage.toDataURL();
    socket.emit("whiteboardData",canvasImg);
  };

  const handleClearCanvas = () => {
    const stage = stageRef.current;
    setRectangles([]);
    setCircles([]);
    setArrows([]);
    setScribbles([]);
    const canvasImg = stage.toDataURL();
    socket.emit("whiteboardData",canvasImg);
  };

  const handleUndo = () => {
    if (allElements.length === 0) return;

    const lastElement = allElements[allElements.length - 1];
    console.log(allElements);

    switch (lastElement.type) {
      case ACTIONS.RECTANGLE:
        setRectangles((prev) => prev.filter((rect) => rect.id !== lastElement.id));
        setHistory((prev)=>[...prev,rectangles[rectangles.length-1]]);
        break;
      case ACTIONS.CIRCLE:
        setCircles((prev) => prev.filter((circle) => circle.id !== lastElement.id));
        setHistory((prev)=>[...prev,circles[circles.length-1]]);
        break;
      case ACTIONS.ARROW:
        setArrows((prev) => prev.filter((arrow) => arrow.id !== lastElement.id));
        setHistory((prev)=>[...prev,arrows[arrows.length-1]]);
        break;
      case ACTIONS.SCRIBBLE:
        setScribbles((prev) => prev.filter((scribble) => scribble.id !== lastElement.id));
        setHistory((prev)=>[...prev,scribbles[scribbles.length-1]]);
        break;
      default:
        break;
    }
    setAllElements((prev) => prev.slice(0, prev.length - 1));
  };

  const handleRedo = () => {
    if (history.length === 0) return;

    const nextElement = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    console.log(nextElement);

    switch (nextElement.type) {
      case ACTIONS.RECTANGLE:
        setRectangles((prev) => [...prev, nextElement]);
        break;
      case ACTIONS.CIRCLE:
        setCircles((prev) => [...prev, nextElement]);
        break;
      case ACTIONS.ARROW:
        setArrows((prev) => [...prev, nextElement]);
        break;
      case ACTIONS.SCRIBBLE:
        setScribbles((prev) => [...prev, nextElement]);
        break;
      default:
        break;
    }
    setAllElements((prev) => [...prev, nextElement]);
  };

  useEffect(()=>{
    socket.on("whiteboardDataResponse",(data)=>{
      setImg(data.imgURL);
    })
  },[socket]);

  useEffect(()=>{
    socket.on("userIsJoined",(data)=>{
      dispatch(userActions.addUser(data.user));
    })
  },[socket,dispatch])
  useEffect(()=>{
    socket.on("allUsers",(data)=>{
      dispatch(userActions.addUser(data.user));
    })
  },[socket,dispatch])

  const handleDownload = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = "image.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

    return (
        <div className=" relative w-full h-screen overflow-hidden">
          <h2 className=" text-blue-600 text-center">Users online: {user.user.length}</h2>
          {user.presenter && <div className="flex justify-center py-3">
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
            </div>}
            <div className="border-2 border-red-700 w-96 h-screen absolute top-0 bg-black">
              <h3 className=" text-slate-100 text-center mt-10">All Users</h3>
              <div>
                {user.user.map((us:initialUserType)=><ul key={us.userId}><li className=" text-slate-100">{`${us.name} ${user.userId === us.userId ? '(you)':''} `}</li></ul>)}
              </div>
            </div>
            {!user.presenter && <div className=" text-center py-2"><h2>Welcome {user.name} to the Room</h2></div>}
           {user.presenter &&  <Stage className="absolute left-96 border-2 border-black" ref={stageRef} width={window.innerWidth} height={window.innerHeight} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerMove={onPointerMove}>
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
            </Stage>}
                {!user.presenter && <div className="absolute left-96 w-full h-full">
                  <img className=" w-full h-full border-2 border-black" src={img} alt="real-time-img" />
                  </div>}
        </div>
    );
}

export default Roompage;
