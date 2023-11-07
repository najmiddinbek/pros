'use client'

import React, { useEffect, useState } from 'react';

const getTopics = async () => {
    const today = new Date();
    const currentTime = today.toTimeString().split(' ')[0];
    const apiUrl = process.env.API_URL;
    const filterDate = new Date(today.getTime() - 1440 * 60000).getTime();

    try {
        const res = await fetch(`/api/topics`, {
            cache: 'no-store',
        });
        if (!res.ok) {
            throw new Error('Mavzularni yuklashda xatolik yuz berdi');
        }

        const { topiclar } = await res.json();
        const filteredTopics = topiclar.filter(topic => {
            const createdAt = new Date(topic.createdAt).getTime();
            return createdAt > filterDate;
        });

        return filteredTopics;
    } catch (error) {
        console.log('Mavzular yuklanishda xatolik: ', error.message);
        return [];
    }
};

export default function Count() {
    const [topicCount, setTopicCount] = useState(() => {
        const storedTopicCount = localStorage.getItem('topicCount');
        return storedTopicCount ? parseInt(storedTopicCount) : 0;
    });

    const [latestTopicId, setLatestTopicId] = useState('');
    const [clickedTopicIds, setClickedTopicIds] = useState(() => {
        const storedClickedTopicIds = localStorage.getItem('clickedTopicIds');
        return storedClickedTopicIds ? JSON.parse(storedClickedTopicIds) : [];
    });

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const filteredTopics = await getTopics();
                const newFilteredTopics = filteredTopics.filter(topic => !clickedTopicIds.includes(topic._id));
                setTopicCount(newFilteredTopics.length);

                if (newFilteredTopics.length > 0) {
                    const latestTopicId = newFilteredTopics[newFilteredTopics.length - 1]._id;
                    setLatestTopicId(latestTopicId);
                }
            } catch (error) {
                console.log('Mavzular olishda xatolik: ', error.message);
            }
        };

        fetchTopics();
    }, [clickedTopicIds]);

    const handleTopicClick = (topicId) => {
        setClickedTopicIds(prevClickedTopicIds => {
            const updatedClickedTopicIds = [...prevClickedTopicIds, topicId];
            localStorage.setItem('clickedTopicIds', JSON.stringify(updatedClickedTopicIds));
            return updatedClickedTopicIds;
        });
    };

    useEffect(() => {
        localStorage.setItem('topicCount', topicCount.toString());
    }, [topicCount]);



    return (
        <>
            <div className="absolute top-1 right-1 bg-red-600 text-[12px] text-white rounded-full px-1.5">
                +{topicCount}
            </div>
        </>
    );
}