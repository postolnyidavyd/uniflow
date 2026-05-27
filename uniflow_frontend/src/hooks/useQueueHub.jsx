import { useDispatch, useSelector } from 'react-redux';
import {
  selectAccessToken,
  selectUserId,
} from '../store/selectors/authSelector.js';
import { useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { queueApi } from '../store/api/queueApi.js';
const BASE_URL = `${import.meta.env.VITE_API_URL}`;

const useQueueHub = (sessionId) => {
  const accessToken = useSelector(selectAccessToken);
  const currentUserId = useSelector(selectUserId);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!sessionId || !accessToken) return;

    const connection = new HubConnectionBuilder()
      .withUrl(`${BASE_URL}/hubs/queue?access_token=${accessToken}`)
      .withAutomaticReconnect()
      .build();

    connection.on('SessionDetailUpdated', (data) => {
      dispatch(
        queueApi.util.updateQueryData('getQueueById', sessionId, () => data)
      );
    });

    connection.on('QueueEntriesUpdated', (entries) => {
      dispatch(
        queueApi.util.updateQueryData('getQueueEntries', sessionId, (draft) => {
          const activeEntry = entries.find(
            (e) =>
              e.userId === currentUserId &&
              (e.entryStatus === 'Waiting' || e.entryStatus === 'InProgress')
          );

          const userEntry = activeEntry
            ? activeEntry
            : draft.userEntry?.entryStatus === 'Completed'
              ? draft.userEntry
              : null;

          return { entries, userEntry };
        })
      );
    });

    connection.onreconnected(() => {
      connection.invoke('JoinSessionGroup', sessionId);
    });

    connection
      .start()
      .then(() => connection.invoke('JoinSessionGroup', sessionId));

    return () => {
      connection
        .invoke('LeaveSessionGroup', sessionId)
        .finally(() => connection.stop());
    };
  }, [sessionId, accessToken, dispatch, currentUserId]);
};

export default useQueueHub;
