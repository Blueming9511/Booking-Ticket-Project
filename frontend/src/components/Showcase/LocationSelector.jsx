import React, { useState } from 'react'
import { Select, Button } from 'antd'
import { EnvironmentOutlined, AimOutlined } from '@ant-design/icons'

// JSON data for cities
const cities = [
  { id: 1, name: 'Hà Nội' },
  { id: 2, name: 'Hồ Chí Minh' },
  { id: 3, name: 'Đà Nẵng' },
  { id: 4, name: 'Cần Thơ' },
  { id: 5, name: 'Hải Phòng' }
]

const LocationSelector = () => {
  const [selectedLocation, setSelectedLocation] = useState('Hà Nội')
  const [isNearby, setIsNearby] = useState(false)

  // Handle selecting a city
  const handleCityChange = value => {
    setSelectedLocation(value)
    setIsNearby(false) // Unselect "Nearby"
  }

  // Handle "Nearby" selection
  const handleNearbyClick = () => {
    setIsNearby(true)
    setSelectedLocation('') // Clear city selection
  }

  return (
    <div className='flex gap-2'>
      {/* Dropdown for City Selection */}
      <Select
        value={selectedLocation || 'Chọn thành phố'}
        onChange={handleCityChange}
        style={{
          width: 180,
          borderRadius: 8,
          borderColor: !isNearby ? 'red' : 'rgb(156, 163, 175)', // Active if city is selected
          color: !isNearby ? 'red' : 'black', // Text color change
          fontWeight: !isNearby ? 'bold' : 'normal',
          transition: 'all 0.3s ease'
        }}
        suffixIcon={
          <EnvironmentOutlined
            style={{ color: !isNearby ? 'red' : 'gray' }}
          />
        }
      >
        {cities.map(city => (
          <Select.Option key={city.id} value={city.name}>
            {city.name}
          </Select.Option>
        ))}
      </Select>

      {/* Button for "Nearby" Feature */}
      <Button
        icon={<AimOutlined />}
        className='font-bold border transition-all duration-300'
        style={{
          borderRadius: 8,
          padding: '6px 12px',
          borderColor: isNearby ? 'red' : 'rgb(156, 163, 175)', // Active if Nearby is selected
          color: isNearby ? 'red' : 'black', // Text color change
          fontWeight: isNearby ? 'bold' : 'normal',
          transition: 'all 0.3s ease'
        }}
        onClick={handleNearbyClick}
      >
        Gần bạn
      </Button>
    </div>
  )
}

export default LocationSelector
