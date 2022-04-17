// our-domain.com/

import MeetupList from '../components/meetups/MeetupList';
import { MongoClient } from 'mongodb';
import Head from 'next/head';
import { Fragment } from 'react';

const HomePage = props => {
    return (
        <Fragment>
            <Head>
                <title>Nextjs Meetups</title>
                <meta
                    name='description'
                    content='Browse a huge list of active meetups'
                />
            </Head>
            <MeetupList meetups={props.meetups} />
        </Fragment>
    );
}

export async function getStaticProps() {
    // fetch data from API

    const client = await MongoClient.connect(process.env.DB_URL)
    const db = client.db();

    const meetupCollection = db.collection('meetups');

    const meetups = await meetupCollection.find().toArray();

    client.close();

    return {
        props: {
            meetups: meetups.map(meetup => ({
                title: meetup.title,
                address: meetup.address,
                img: meetup.img,
                id: meetup._id.toString()
            }))
        },
        revalidate: 1
    };
}

export default HomePage;