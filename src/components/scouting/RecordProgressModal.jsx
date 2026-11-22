/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useMatches } from '../../hooks/useMatches';
import { usePlayers } from '../../hooks/usePlayers';
import { getActionsSelectApi } from '../../api/endpoints';
import { useToast } from '../../context/ToastContext';
import { Activity } from 'lucide-react';

export function RecordProgressModal({ isOpen, onClose, onRecord, defaultMatchId, defaultPlayerId }) {
  const { items: matches } = useMatches({ limit: 100 });
  const { items: players } = usePlayers({ limit: 100 });
  const { addToast } = useToast();

  const [matchId, setMatchId] = useState(defaultMatchId || '');
  const [playerId, setPlayerId] = useState(defaultPlayerId || '');
  const [actionId, setActionId] = useState('');
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultMatchId) setMatchId(defaultMatchId);
    if (defaultPlayerId) setPlayerId(defaultPlayerId);
  }, [defaultMatchId, defaultPlayerId]);

  useEffect(() => {
    const loadActions = async () => {
      try {
        const res = await getActionsSelectApi();
        const list = res.data?.data?.items || res.data?.data || [];
        setActions(list);
        if (list.length > 0) {
          setActionId((currentActionId) => currentActionId || list[0]._id);
        }
      } catch (requestError) {
        addToast(requestError.response?.data?.error?.message || requestError.message || 'Unable to load actions', 'error');
      }
    };
    if (isOpen) {
      loadActions();
    }
  }, [isOpen, addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!matchId || !playerId || !actionId) {
      addToast('Please select match, player, and action', 'error');
      return;
    }
    setLoading(true);
    try {
      await onRecord({
        match_id: matchId,
        player_id: playerId,
        action_id: actionId,
      });
      addToast('Player progress event recorded successfully!');
      onClose();
    } catch {
      addToast('Failed to record event', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Scouting Action Event" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Match Selection */}
        <div>
          <label className="block text-xs font-semibold text-purple-950 mb-1.5">
            1. Select Match
          </label>
          <select
            value={matchId}
            onChange={(e) => setMatchId(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs text-purple-950 focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
            required
          >
            <option value="">-- Choose Match --</option>
            {matches.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} ({new Date(m.date).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        {/* Player Selection */}
        <div>
          <label className="block text-xs font-semibold text-purple-950 mb-1.5">
            2. Select Player
          </label>
          <select
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs text-purple-950 focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 bg-white"
            required
          >
            <option value="">-- Choose Player --</option>
            {players.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.team_id?.name || 'Squad'})
              </option>
            ))}
          </select>
        </div>

        {/* Action Selection */}
        <div>
          <label className="block text-xs font-semibold text-purple-950 mb-1.5">
            3. Action Event
          </label>
          <div className="grid grid-cols-2 gap-2">
            {actions.map((act) => {
              const isSelected = actionId === act._id;
              return (
                <button
                  type="button"
                  key={act._id}
                  onClick={() => setActionId(act._id)}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-purple-50/50 hover:bg-purple-100/50 text-purple-900 border-purple-200'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>{act.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-purple-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !matchId || !playerId || !actionId}
            className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            {loading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Record Action
          </button>
        </div>
      </form>
    </Modal>
  );
}

