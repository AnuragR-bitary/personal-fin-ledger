import { useState } from 'react';
import FriendList from '../components/FriendList';
import AddDebtForm from '../components/AddDebtForm';
import DebtList from '../components/DebtList';

export default function Dashboard() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleDataChange = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="grid grid-cols-[1fr_2fr] gap-6 max-h-screen">
            <div className="flex flex-col gap-6">
                <FriendList />
                <AddDebtForm onSuccess={handleDataChange} />
            </div>
            <div className="flex flex-col w-full h-full overflow-y-auto pr-4">
                <DebtList refreshTrigger={refreshTrigger} />
            </div>
        </div>
    );
}
