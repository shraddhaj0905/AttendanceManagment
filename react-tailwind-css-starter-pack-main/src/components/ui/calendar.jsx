// import React, { useState } from "react";
// import { format } from "date-fns";

// export function Calendar() {
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   return (
//     <div className="p-4 border rounded-lg">
//       <p className="font-semibold">Selected Date: {format(selectedDate, "PPP")}</p>
//       <input
//         type="date"
//         className="border rounded p-2"
//         value={format(selectedDate, "yyyy-MM-dd")}
//         onChange={(e) => setSelectedDate(new Date(e.target.value))}
//       />
//     </div>
//   );
// }
import React, { useState } from "react";
import { format } from "date-fns";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="p-4 border rounded-lg">
      <p className="font-semibold">Selected Date: {format(selectedDate, "PPP")}</p>
      <input
        type="date"
        className="border rounded p-2"
        value={format(selectedDate, "yyyy-MM-dd")}
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
      />
    </div>
  );
};

export default Calendar;
