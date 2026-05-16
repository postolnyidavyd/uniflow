import { useDispatch } from 'react-redux';
import { openCreateSubjectModal } from '../store/uiSlice.js';

function SubjectsPage() {
  const dispatch = useDispatch();
  dispatch(openCreateSubjectModal());
  return <div>SubjectsPage</div>;
}

export default SubjectsPage;
