import { RoomType, Room } from './booking.model';

export const ROOM_TYPES: RoomType[] = [
    { id: 1, type: 'Classic', rate: 120 },
    { id: 2, type: 'Deluxe', rate: 200 },
    { id: 3, type: 'Prestige', rate: 150 },
    { id: 4, type: 'Luxury', rate: 80 }
];

export const ROOMS: Room[] = [];

ROOM_TYPES.forEach(roomType => {
  let floors = 1;
  let roomsPerFloor = 1;

  switch (roomType.type) {
    case 'Classic': 
      floors = 2;
      roomsPerFloor = 8;
      break;
    case 'Deluxe':
      floors = 2;
      roomsPerFloor = 5;
      break;
    case 'Prestige':
      floors = 2;
      roomsPerFloor = 3;
      break;
    case 'Luxury':
      floors = 1;
      roomsPerFloor = 4;
      break;
  }

  for (let floor = 1; floor <= floors; floor++) {
    for (let i = 1; i <= roomsPerFloor; i++) {
      const room_number = roomType.id * 100 + floor * i;
      ROOMS.push({
        id: ROOMS.length + 1,
        room_number,
        room_type_id: roomType.id,
        floor,
        status: true,
        roomType
      });
    }
  }
});