import { MessageType, PaginatedMessagesDataType,   } from "@/api-calls/channels";
import moment from "moment";
import { InfiniteData } from "react-query";

export const updatePaginatedDataWithNewMessage = (
    prevData: InfiniteData<PaginatedMessagesDataType | null> | null,
    newMessage: MessageType
  ): InfiniteData<PaginatedMessagesDataType | null> => {
    if (!prevData) {
      return {
        pageParams: [undefined],
        pages: [{ results: [newMessage] }]
      };
    }
  
    // Add the new message to the first page's results
    const updatedPages = prevData.pages.map((page, index) => {
        const updatedMessages = replaceMessageObjectById(page.results, newMessage);
        return {
          ...page,
          results: updatedMessages
        };

    });
  
    return {
      ...prevData,
      pages: updatedPages
    };
  };


  function replaceMessageObjectById(array: MessageType[], newObject: MessageType) {
    const index = array.findIndex(
      (item) =>
        (item?.uuid && newObject?.uuid && item?.uuid === newObject?.uuid) ||
        item.id === newObject.id
    );
  
    if (index !== -1) {
      // Replace the object at the found index
      array.splice(index, 1, newObject);
      console.log({ arrayBefore: array });
      return array;
    } else {
      return [newObject, ...array];
    }
  }
  


  export const formatTimestamp = (timestamp: string) => {
    const now = moment();
    const messageTime = moment(timestamp);
  
    // Check if the timestamp is within the last 24 hours
    if (now.diff(messageTime, "hours") < 24) {
      // Show only the time (e.g., 22:45)
      return messageTime.format("HH:mm");
    }
    // Check if the timestamp is within the last 7 days
    else if (now.diff(messageTime, "days") < 7) {
      // Show the day of the week and time (e.g., Sunday 22:45)
      return messageTime.format("dddd HH:mm");
    }
    // Otherwise, show full date and time (e.g., 4 Sep 2024, 19:25)
    else {
      return messageTime.format("D MMM YYYY, HH:mm");
    }
  };
  
 export function isDifferenceMoreThan15Minutes(timestamp1: string, timestamp2: string) {
    const date1 = moment(timestamp1);
    const date2 = moment(timestamp2);
  
    // Calculate the difference in minutes between the two timestamps
    const differenceInMinutes = Math.abs(date1.diff(date2, "minutes"));
  
    // Return true if the difference is more than 15 minutes, false otherwise
    return differenceInMinutes > 15;
  }
  