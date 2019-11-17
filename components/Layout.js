import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';

export default class Layout extends App {
    render() {
        return <div>
            <Head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            </Head>
            {this.props.children}
        </div>
    }
}
