import '../../App.css';
import { ChatPreview } from '../../interfaces/chat_preview.interface';

interface ChatPanelProps {
    chatInfo?: ChatPreview
}

const ChatPanel = ({chatInfo}: ChatPanelProps) => {

    const handleIds = Object.values(chatInfo?.handle_ids || {});

    return (
        <div className='grid grid-cols-6 '>
            {chatInfo?.display_name ? 
            <div className='border-r-gray-300 border-r-2 inline-block py-3 my-3 col-span-1'>
                <div className='text-gray-800 pr-4 text-center text-xl'>{chatInfo?.display_name}</div>
            </div> :
            <></>
            }
            <div className={`${chatInfo?.display_name ? 'col-span-4' : 'col-span-5'} overflow-x-auto p-3`}>
                <div className='flex space-x-2'>
                    {handleIds.map((handle, index) => (
                        <p key={index} className="rounded-full m-0.5 inline-block px-1.5 bg-blue-300 text-gray-500">{handle}</p>
                    ))}
                </div>
            </div>
            <div></div>
        </div>
    )
}

export default ChatPanel
