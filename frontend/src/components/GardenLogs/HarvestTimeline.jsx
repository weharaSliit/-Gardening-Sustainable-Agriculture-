import React from "react";

const HarvestTimeline = ({ calendarData }) => {
  // Generate a list of months for the timeline header
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Group activities by month
  const groupActivitiesByMonth = (calendarData) => {
    const grouped = Array(12).fill(null).map(() => []);
    calendarData.forEach((entry) => {
      const sowMonth = new Date(entry.sowDate).getMonth();
      const plantMonth = new Date(entry.plantDate).getMonth();
      const startMonth = new Date(entry.startDate).getMonth();
      const endMonth = new Date(entry.endDate).getMonth();

      grouped[sowMonth].push({ type: "Sow", date: entry.sowDate, entry });
      grouped[plantMonth].push({ type: "Plant", date: entry.plantDate, entry });
      for (let month = startMonth; month <= endMonth; month++) {
        grouped[month].push({ type: "Harvest", date: entry.startDate, entry });
      }
    });
    return grouped;
  };

  const groupedActivities = groupActivitiesByMonth(calendarData);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-green-800 mb-4">Harvest Timeline</h2>

      {/* Timeline Container */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-[150px_repeat(12,_1fr)] gap-2">
          {/* Header Row */}
          <div className="bg-green-100 font-bold text-center p-2">Crop</div>
          {months.map((month, index) => (
            <div
              key={index}
              className="bg-green-100 font-bold text-center p-2 border-l border-green-300"
            >
              {month}
            </div>
          ))}

          {/* Timeline Rows */}
          {calendarData.map((entry, index) => (
            <React.Fragment key={index}>
              {/* Crop Name */}
              <div className="bg-green-50 font-medium text-green-700 p-2 border border-green-300">
                {entry.vegetable}
              </div>

              {/* Timeline Blocks */}
              {Array.from({ length: 12 }).map((_, monthIndex) => {
                const activities = groupedActivities[monthIndex].filter(
                  (activity) => activity.entry.id === entry.id
                );

                return (
                  <div
                    key={monthIndex}
                    className="p-2 border border-green-300 bg-gray-100 flex flex-col space-y-1"
                  >
                    {activities.map((activity, activityIndex) => {
                      let blockStyle = "";
                      if (activity.type === "Sow") {
                        blockStyle = "bg-blue-500 text-white font-bold";
                      } else if (activity.type === "Plant") {
                        blockStyle = "bg-yellow-500 text-white font-bold";
                      } else if (activity.type === "Harvest") {
                        blockStyle = "bg-green-500 text-white font-bold";
                      }

                      return (
                        <div
                          key={activityIndex}
                          className={`p-1 rounded ${blockStyle}`}
                          title={`${activity.type} Date: ${new Date(activity.date).toLocaleDateString()}`}
                        >
                          <span>{activity.type}</span>
                          <span className="block text-xs">
                            {new Date(activity.date).toLocaleDateString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HarvestTimeline;