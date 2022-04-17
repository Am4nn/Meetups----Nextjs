// our-domain.com/:meetupId

import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from 'mongodb';
import { Fragment } from "react";
import Head from 'next/head';

const MeetupDetails = props => {
    return (
        <Fragment>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta
                    name='description'
                    content={props.meetupData.description}
                />
            </Head>
            <MeetupDetail img={props.meetupData.img} title={props.meetupData.title} address={props.meetupData.address} description={props.meetupData.description} />
        </Fragment>
    );
}

export async function getStaticPaths() {


    const client = await MongoClient.connect(process.env.DB_URL);
    const db = client.db();

    const meetupCollection = db.collection('meetups');

    const meetups = await meetupCollection.find({}, { _id: 1 }).toArray();

    client.close();

    return {
        fallback: false,
        paths: meetups.map(meetup => ({
            params: { meetupId: meetup._id.toString() }
        }))
    };
}

export async function getStaticProps(context) {
    // fetch data from API

    const meetupId = context.params.meetupId;

    const client = await MongoClient.connect('mongodb+srv://am4n_arya:88GaaXXn6MdPIPU0@cluster0.kgjmd.mongodb.net/meetupsnextjsProject1?retryWrites=true&w=majority')
    const db = client.db();

    const meetupCollection = db.collection('meetups');

    const selectedMeetup = await meetupCollection.findOne({ _id: ObjectId(meetupId) });
    console.log(selectedMeetup);

    client.close();

    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                description: selectedMeetup.description,
                img: selectedMeetup.img,
                address: selectedMeetup.address
            }
        },
        revalidate: 1
    };
}

export default MeetupDetails;