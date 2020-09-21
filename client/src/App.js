// client/src/App.js

    import React, { Component } from 'react';
    import Pusher from 'pusher-js';
    import pushid from 'pushid';
    import './App.css';

    class App extends Component {
      state = {
        newsItems: [],
      }

      componentDidMount() {
        fetch('http://localhost:5000/live?q=California Wildfire')
          .then(response => response.json())
          .then(articles => {
            this.setState({
              newsItems: [...this.state.newsItems, ...articles],
            });
          }).catch(error => console.log(error));

        const pusher = new Pusher('<your app key>', {
          cluster: '<your app cluster>',
          encrypted: true,
        });

        const channel = pusher.subscribe('news-channel');
        channel.bind('update-news', data => {
          this.setState({
            newsItems: [...data.articles, ...this.state.newsItems],
          });
        });
      }

      render() {
        const NewsItem = (article, id) => (
            <tr>
              <td>
                <img src = {article.urlToImage} width = "100" height = "100"/>
              </td>
              <td>
                <a href={`${article.url}`}>{article.title} by {article.author} <br/>At {article.publishedAt} 
                </a>
                <br/>{article.description}
                <br/><br/>
              </td>
            </tr>
        );

        const newsItems = this.state.newsItems.map(e => NewsItem(e, pushid()));

        return (
          <div className="App">
            <h1 className="App-title">Live California Wildfires Feed</h1>
            <table>
              {newsItems}
            </table>
          </div>
        );
      }
    }

    export default App;