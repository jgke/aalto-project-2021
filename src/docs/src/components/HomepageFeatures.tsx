import useBaseUrl from '@docusaurus/useBaseUrl';
import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

type FeatureItem = {
    title: string;
    image: string;
    description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
    {
        title: "Welcome to the documentation",
        image: "/img/homepage_graph2.png",
        description: (
            <>
                <p>
                    This is the documentation for our app. 
                </p>
                <p>
                    The purpose of this app to make task management easier by visualizing
                    dependencies between tasks. Since Jira is a bit clunky and Trello 
                </p>

                <p>
                    Since Jira feels a bit clunky and in Trello it is difficult
                    to follow task dependencies the graph based task management
                    software was created to solve these issues.
                </p>
                <p>
                    The main function of this software is to able to manage your
                    project better by being able to see things like task name,
                    priority of the task, what is the current status of the task
                    using simple to create nodes. Nodes can be connected to each
                    other via edges showing the dependency between the two. An
                    edge has an arrow representing, which task should be done
                    first. All nodes can be freely moved in the graph that they
                    are inserted in allowing for easy customization.
                </p>
            </>
        )
    }

];

function Feature({ title, image, description }: FeatureItem) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <img
                    className={styles.featureSvg}
                    alt={title}
                    src={useBaseUrl(image)}
                />
            </div>
            <div className="text--left padding-horiz--md">
                <h3 className="text--center">{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
}

export function HomepageFeatures(): JSX.Element {
    return (
        <section className={styles.features}>
            <div className="container">
                <div>
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}

