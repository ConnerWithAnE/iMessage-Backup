import MessagePane from "./MessagePane";
import "../App.css";

interface ChatProps {
  id: number;
}

export default function Chat({id}: ChatProps) {
    return (
    <div className="bg-red-400">
      <MessagePane id={24} />
    
    
    </div>
    );
}
