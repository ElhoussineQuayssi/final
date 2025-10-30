import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ContentCard = ({
  title,
  excerpt,
  image,
  link,
  category,
  date,
  index
}) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {image && (
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-8">
        {category && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
            {category}
          </span>
        )}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          <Link href={link} className="hover:text-blue-600 transition-colors">
            {title}
          </Link>
        </h3>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        {date && (
          <p className="text-sm text-gray-500">{new Date(date).toLocaleDateString()}</p>
        )}
        <Link
          href={link}
          className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
        >
          Lire plus →
        </Link>
      </div>
    </article>
  );
};

export default ContentCard;