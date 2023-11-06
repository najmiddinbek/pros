import React, { useEffect, useState } from 'react';

const getTopics = async () => {
    const today = new Date();
    const currentTime = today.toTimeString().split(' ')[0];
    const filterDate = new Date(today.getTime() - 1440 * 60000).getTime();

    try {
        const res = await fetch('/api/topics', {
            cache: 'no-store',
        });
        if (!res.ok) {
            throw new Error('An error occurred while loading topics');
        }

        const { topics } = await res.json();
        const filteredTopics = topics.filter((topic) => {
            const createdAt = new Date(topic.createdAt).getTime();
            return createdAt > filterDate;
        });

        return filteredTopics;
    } catch (error) {
        console.log('Error loading topics: ', error.message);
        return [];
    }
};

export default function Count() {
    const [topicCount, setTopicCount] = useState(0);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const filteredTopics = await getTopics();
                setTopicCount(filteredTopics.length);
            } catch (error) {
                console.log('Error getting topics: ', error.message);
            }
        };

        fetchTopics();
    }, []);

    return (
        <>
            <div className="absolute top-1 right-1 bg-red-600 text-[12px] text-white rounded-full px-1.5">
                +{topicCount}
            </div>
        </>
    );
}

