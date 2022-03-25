import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import { HomepageFeatures } from '../components/HomepageFeatures';
import styles from './index.module.css';

function HomepageHeader() {
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <h1 className="hero__title">Documentation</h1>
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
            <HomepageFeatures />
        </Layout>
    );
}
