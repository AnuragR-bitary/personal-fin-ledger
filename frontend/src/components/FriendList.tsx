import { useState, useEffect } from 'react';
import { getFriends, createFriend } from '../services/api';
import type { Friend } from '../services/api';
import { UserPlus, User } from 'lucide-react';

export default function FriendList() {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [newFriend, setNewFriend] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const data = await getFriends();
                setFriends(data);
            } catch (err) {
                console.error('Failed to load friends', err);
            }
        };
        fetchFriends();
    }, []);

    const handleAddFriend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFriend.trim()) return;

        setLoading(true);
        try {
            await createFriend(newFriend);
            setNewFriend('');
            // Optimistically fetch again
            const data = await getFriends();
            setFriends(data);
        } catch (error) {
            console.error('Failed to add friend', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card hover-lift">
            <h2 className="text-xl mb-4 flex items-center gap-2">
                <UserPlus size={20} className="text-accent-primary" />
                Friends
            </h2>

            <form onSubmit={handleAddFriend} className="flex gap-2 mb-6">
                <input
                    type="text"
                    placeholder="New friend's name..."
                    className="flex-1"
                    value={newFriend}
                    onChange={(e) => setNewFriend(e.target.value)}
                    disabled={loading}
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Adding...' : 'Add'}
                </button>
            </form>

            {friends.length === 0 ? (
                <p className="text-secondary text-sm">No friends added yet.</p>
            ) : (
                <ul className="grid gap-2">
                    {friends.map((friend) => (
                        <li key={friend.id} className="flex justify-between items-center p-3 bg-secondary rounded-lg border border-border">
                            <span className="flex items-center gap-3">
                                <div className="bg-primary p-2 rounded-full text-accent-secondary">
                                    <User size={16} />
                                </div>
                                {friend.name}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
