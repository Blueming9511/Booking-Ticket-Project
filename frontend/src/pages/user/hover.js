import React from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Tag, 
  Typography, 
  Divider, 
  List,
  Avatar,
  Rate,
  Button,
  Space,
  Popover
} from 'antd';
import { 
  UserOutlined, 
  DollarOutlined, 
  CalendarOutlined,
  VideoCameraOutlined,
  GlobalOutlined,
  ShopOutlined,
  PlayCircleOutlined,
  StarOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const movie = {
  thumbnail: 'https://image.tmdb.org/t/p/w200/kyeqWdyUXW608qlYkRqosgbbJyK.jpg',
  title: 'Avatar: The Way of Water',
  genre: ['Sci-Fi', 'Adventure'],
  releaseYear: 2022,
  director: 'James Cameron',
  rating: 7.8,
  duration: 192,
  language: 'English',
  budget: 250000000,
  boxOffice: 2320000000,
  casts: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
  releasedBy: 'CGV',
  releaseDate: '2022-12-16T00:00:00Z',
  endDate: '2023-03-15T00:00:00Z',
  status: 'Ended',
  description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
  trailer: "https://www.youtube.com/watch?v=d9MyW72ELq0"
};

export default function MovieDetails() {
  // Format runtime
  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Extract YouTube video ID
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const trailerId = getYouTubeId(movie.trailer);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <Row gutter={[24, 24]}>
        {/* Left Column - Poster and Trailer */}
        <Col xs={24} md={8}>
          <Card
            cover={
              <img
                alt={movie.title}
                src={movie.thumbnail.replace('/w200', '/w500')}
                style={{ width: '100%' }}
              />
            }
            actions={[
              <Button 
                type="primary" 
                icon={<PlayCircleOutlined />} 
                href={movie.trailer} 
                target="_blank"
                block
              >
                Watch Trailer
              </Button>
            ]}
          >
            <Card.Meta
              title="Trailer Preview"
              description={
                trailerId && (
                  <div style={{ marginTop: '16px' }}>
                    <iframe
                      width="100%"
                      height="200"
                      src={`https://www.youtube.com/embed/${trailerId}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )
              }
            />
          </Card>
        </Col>

        {/* Right Column - Movie Details */}
        <Col xs={24} md={16}>
          <Card>
            <Title level={2}>
              {movie.title} <Text type="secondary">({movie.releaseYear})</Text>
            </Title>

            <Space size={[8, 16]} wrap style={{ marginBottom: '16px' }}>
              {movie.genre.map((genre, index) => (
                <Tag color="blue" key={index}>
                  {genre}
                </Tag>
              ))}
              <Tag icon={<GlobalOutlined />}>{movie.language}</Tag>
              <Tag icon={<VideoCameraOutlined />}>{formatRuntime(movie.duration)}</Tag>
              <Rate 
                disabled 
                allowHalf 
                defaultValue={movie.rating / 2} 
                character={<StarOutlined />}
                style={{ color: '#faad14' }}
              />
              <Text>({movie.rating}/10)</Text>
            </Space>

            <Paragraph style={{ fontSize: '16px', marginBottom: '24px' }}>
              {movie.description}
            </Paragraph>

            <Divider orientation="left">Details</Divider>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <List
                  size="small"
                  dataSource={[
                    { label: 'Director', value: movie.director, icon: <UserOutlined /> },
                    { label: 'Release Date', value: formatDate(movie.releaseDate), icon: <CalendarOutlined /> },
                    { label: 'Status', value: movie.status, icon: null },
                    { label: 'Cinema', value: movie.releasedBy, icon: <ShopOutlined /> },
                  ]}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={item.icon}
                        title={item.label}
                        description={
                          item.label === 'Status' ? (
                            <Tag color={movie.status === 'Ended' ? 'red' : 'green'}>
                              {item.value}
                            </Tag>
                          ) : (
                            item.value
                          )
                        }
                      />
                    </List.Item>
                  )}
                />
              </Col>
              <Col xs={24} md={12}>
                <List
                  size="small"
                  dataSource={[
                    { label: 'Budget', value: formatCurrency(movie.budget), icon: <DollarOutlined /> },
                    { label: 'Box Office', value: formatCurrency(movie.boxOffice), icon: <DollarOutlined /> },
                  ]}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={item.icon}
                        title={item.label}
                        description={item.value}
                      />
                    </List.Item>
                  )}
                />
              </Col>
            </Row>

            <Divider orientation="left">Cast</Divider>
            <Space size={[8, 16]} wrap>
              {movie.casts.map((actor, index) => (
                <Popover key={index} content={`Plays in ${movie.title}`}>
                  <Tag icon={<UserOutlined />}>{actor}</Tag>
                </Popover>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}