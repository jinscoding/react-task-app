import { useState } from 'react'
import BoardList from './components/BoardList/BoardList'
import ListsContainer from './components/ListsContainer/ListsContainer.tsx';
import { useTypedDispatch, useTypedSelector } from './hooks/redux.ts';
import { board, buttons, deleteBoardButton, loggerButton } from './App.css';
import { appContainer } from './App.css';
import EditModal from './components/EditModal/EditModal.tsx';
import LoggerModal from './components/LoggerModal/LoggerModal.tsx';
import { deleteBoard } from './store/slices/boardsSlice.ts';
import { addLog } from './store/slices/logerSlice.ts';
import { v4 } from 'uuid';
import { DragDropContext } from 'react-beautiful-dnd';

function App() {
  const dispatch = useTypedDispatch();
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [activeBoardId, setActiveBoardId] = useState('board-0');
  const modalActive = useTypedSelector(state => state.boards.modalActive);
  const boards = useTypedSelector(state => state.boards.boardArray);

  const getActiveBoard = boards.filter(board => board.boardId === activeBoardId)[0];

  const lists = getActiveBoard.lists;

  const handleDeleteBoard = () => {
    if(boards.length > 1){
      dispatch(
        deleteBoard({ boardId: getActiveBoard.boardId})
      )

      dispatch(
        addLog({
          logId: v4(),
          logMessage: `게시판 지우기: ${getActiveBoard.boardName}`,
          logAuthor: "User",
          logTimestamp: String(Date.now())
        })
      )

      const newIndexToSet = () => {
        const indexToBeDeleted = boards.findIndex(
          board => board.boardId === activeBoardId
        )

        return indexToBeDeleted === 0
          ? indexToBeDeleted + 1
          : indexToBeDeleted - 1;
      }

      setActiveBoardId(boards[newIndexToSet()].boardId)
    } else {
      alert('최소 게시판 개수는 한 개입니다.');
    }
  }

  const handleDragEnd = (result: any) => {
    console.log(result);
    const {destination, source, draggableId} = result;

    const sourceList
  }

  return (
    <div className={appContainer}>
      {isLoggerOpen ? <LoggerModal setIsLoggerOpen={setIsLoggerOpen} /> : null}
      {modalActive ? <EditModal /> : null}
        <BoardList 
          activeBoardId={activeBoardId} 
          setActiveBoardId={setActiveBoardId}
        />
      <div className={board}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <ListsContainer lists = {lists} boardId= {getActiveBoard.boardId}/>
          </DragDropContext>
      </div>
      <div className={buttons}>
        <button className={deleteBoardButton} onClick = {handleDeleteBoard}>
          이 게시판 삭제하기
        </button>
        <button className={loggerButton} onClick={() => setIsLoggerOpen(!isLoggerOpen)}>
          {isLoggerOpen ? "활동 목록 숨기기": "활동 목록 보이기"}
        </button>
      </div>
        
   </div>
  )
}

export default App
