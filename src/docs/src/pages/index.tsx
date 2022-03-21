import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function HomepageHeader() {
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div>
                <h1 className="hero__title">
                    Graph based task management software
                </h1>
                <h2>
                    Since Jira feels a bit clunky and in Trello it is difficult
                    to follow task dependencies the graph based task management
                    software was created to solve these issues.
                </h2>
                <h2>
                    The main function of this software is to able to manage your
                    project better by being able to see things like task name,
                    priority of the task, what is the current status of the task
                    using simple to create nodes. Nodes can be connected to each
                    other via edges showing the dependency between the two. An
                    edge has an arrow representing, which task should be done
                    first. All nodes can be freely moved in the graph that they
                    are inserted in allowing for easy customization.
                </h2>
            </div>
        </header>
    );
}

// eslint-disable-next-line import/no-default-export
export default function Home(): JSX.Element {
    return (
        <Layout
            title={'Task Management Documentation'}
            description="Documentation of the software<head />"
        >
            <HomepageHeader />
        </Layout>
    );
}
