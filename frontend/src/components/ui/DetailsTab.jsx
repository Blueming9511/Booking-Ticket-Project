import React from "react";
import { StarFilled } from "@ant-design/icons";
import FieldDisplay from "./FieldDisplay";
import DynamicGrid from "./DynamicGrid";

const DetailsTab = ({ data }) => {
  const renderRating = (rating) => (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <StarFilled
          key={i}
          className={`${
            i < Math.round(parseFloat(rating) / 2) ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-2">({rating}/10)</span>
    </>
  );

  const fields = [
    <FieldDisplay label="Genre" value={data.genre} icon="🎭" />,
    <FieldDisplay label="Release Year" value={data.releaseYear} icon="📅" />,
    <FieldDisplay label="Director" value={data.director} icon="🎬" />,
    <FieldDisplay label="Rating" value={data.rating} icon="⭐" renderValue={renderRating} />,
    <FieldDisplay label="Duration" value={`${data.duration} minutes`} icon="⏳" />,
    <FieldDisplay label="Language" value={data.language} icon="🗣️" />,
    <FieldDisplay label="Release Date" value={data.releaseDate} icon="📅" />,
    <FieldDisplay label="Budget" value={data.budget} icon="💰" />,
    <FieldDisplay label="Box Office" value={data.boxOffice} icon="💵" />,
    <FieldDisplay label="Cast" value={data.casts?.join(", ")} icon="🎥" />,
    <FieldDisplay label="Released By" value={data.releasedBy} icon="🏬" />,
    <FieldDisplay label="End Date" value={data.endDate} icon="📅" />,
  ];

  return <DynamicGrid fields={fields} columns={2} shadow={false} />;
};

export default DetailsTab;