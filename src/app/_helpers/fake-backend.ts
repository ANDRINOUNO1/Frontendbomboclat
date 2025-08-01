import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

import { Account } from '../_models/account.model';
import { Role } from '../_models/role.model';
import { Booking, Room, RoomType } from '../_models/booking.model';
import { RESERVATION_FEES } from '../_models/entities';

const isBrowser = typeof window !== 'undefined';


const roomTypesKey = 'fake-room-types';
const accountsKey = 'fake-accounts';
const bookingsKey = 'fake-bookings';
const roomsKey = 'fake-rooms';

//tangtanga lng ang mga slash if need mag clear nya himo bag o nga localstorage
//if (isBrowser) {
//  localStorage.removeItem(accountsKey);
//  localStorage.removeItem(bookingsKey);
//  localStorage.removeItem(roomsKey);
//  localStorage.removeItem(roomTypesKey);
//}

let accounts: Account[] = [];
if (isBrowser) {
  accounts = JSON.parse(localStorage.getItem(accountsKey) || '[]');

  if (accounts.length === 0) {
    accounts = [
      {
        id: '1',
        title: 'superadmin',
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@example.com',
        status: 'Active',
        role: Role.SuperAdmin,
        password: 'superadmin123'
      },
      {
        id: '3',
        title: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        status: 'Active',
        role: Role.Admin,
        password: 'admin123'
      },
      {
        id: '2',
        title: 'frontdesk',
        firstName: 'Front',
        lastName: 'Desk',
        email: 'frontdesk@example.com',
        status: 'Active',
        role: Role.frontdeskUser,
        password: 'frontdesk123'
      }
      
      
    ];
    localStorage.setItem(accountsKey, JSON.stringify(accounts));
  }
}


let roomTypes: RoomType[] = [];

if (isBrowser) {
  roomTypes = JSON.parse(localStorage.getItem(roomTypesKey) || 'null');

  if (!roomTypes) {
    roomTypes = [
      { id: 1, type: 'Classic', rate: 120 },
      { id: 2, type: 'Deluxe', rate: 200 },
      { id: 3, type: 'Prestige', rate: 150 },
      { id: 4, type: 'Luxury', rate: 80 }
    ];
    localStorage.setItem(roomTypesKey, JSON.stringify(roomTypes));
  }
}


let bookings: Booking[] = isBrowser ? JSON.parse(localStorage.getItem(bookingsKey) || '[]') : [];


let rooms: Room[] = [];

if (isBrowser) {
  rooms = JSON.parse(localStorage.getItem(roomsKey) || 'null');

  if (!rooms) {
    rooms = [];

    roomTypes.forEach((roomType: RoomType) => {
      let floors = 1;
      let roomsPerFloor = 1;

      switch (roomType.type) {
        case 'Classic': floors = 2; roomsPerFloor = 8; break;
        case 'Deluxe': floors = 2; roomsPerFloor = 5; break;
        case 'Prestige': floors = 2; roomsPerFloor = 3; break;
        case 'Luxury': floors = 1; roomsPerFloor = 4; break;
      }

      for (let floor = 1; floor <= floors; floor++) {
        for (let i = 1; i <= roomsPerFloor; i++) {
          const baseNumber = roomType.id * 100 + i;
          const roomNumber = `${baseNumber}-${floor}`;

                     rooms.push({
             id: rooms.length + 1,
             roomNumber,
             room_type_id: roomType.id,
             floor,
             status: true,
             RoomType: roomType
           });
        }
      }
    });

    localStorage.setItem(roomsKey, JSON.stringify(rooms));
  }
}

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    return handleRoute().pipe(materialize(), delay(500), dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith('/api/accounts/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/api/accounts/register') && method === 'POST':
          return register();
        case url.endsWith('/api/accounts') && method === 'GET':
          return getAccounts();
        case url.match(/\/api\/accounts\/\w+$/) && method === 'GET':
          return getAccountById();
        case url.match(/\/api\/accounts\/\w+$/) && method === 'PUT':
          return updateAccount();
        case url.match(/\/api\/accounts\/\w+$/) && method === 'DELETE':
          return deleteAccount();
        case url.endsWith('/api/room-types') && method === 'GET':
          return getRoomTypes();
        case url.match(/\/api\/room-types\/\d+$/) && method === 'PUT':
          return updateRoomType();
        case url.endsWith('/api/bookings') && method === 'POST':
          return createBooking();
        case url.endsWith('/api/rooms') && method === 'GET':
          return getRooms();
        case url.endsWith('/api/bookings') && method === 'GET':
          return getBookings();
        case url.match(/\/api\/bookings\/\d+$/) && method === 'PUT':
            return updateBooking();
        case url.match(/\/api\/bookings\/\d+$/) && method === 'DELETE':
            return deleteBooking();
        case url.endsWith('/api/reset') && method === 'POST':
            return resetData();
        default:
          return next.handle(request);
      }
    }

    // ✅ Fake handlers
    function authenticate() {
      const { email, password, username } = body;
      const account = accounts.find(x =>
        ((x.title && x.title.toLowerCase() === (username || '').toLowerCase()) ||
          (x.email && x.email.toLowerCase() === (email || '').toLowerCase())) &&
        x.password === password &&
        x.status === 'Active'
      );
      if (!account) return error('Email or password is incorrect');

      account.jwtToken = 'fake-jwt-token.' + btoa(JSON.stringify({ id: account.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 }));
      return ok({ ...account });
    }

    function register() {
      const account = body as Account;
      if (accounts.find(x => x.email === account.email)) {
        return error('Email is already registered');
      }
      account.id = (accounts.length + 1).toString();
      account.role = Role.frontdeskUser;
      account.status = 'Pending'; 
      account.password = account.password || 'changeme';
      accounts.push(account);

      if (isBrowser) localStorage.setItem(accountsKey, JSON.stringify(accounts));

      return ok(account);
    }

    function getAccounts() {
      return ok(accounts);
    }

    function getAccountById() {
      if (!isLoggedIn()) return unauthorized();
      const account = accounts.find(x => x.id === idFromUrl());
      return ok(account);
    }

    function updateAccount() {
      let params = body;
      let account = accounts.find(x => x.id === idFromUrl());
      if (!account) return error('Account not found');
      Object.assign(account, params);
      if (isBrowser) localStorage.setItem(accountsKey, JSON.stringify(accounts));
      return ok(account);
    }

    function deleteAccount() {
      if (!isLoggedIn()) return unauthorized();
      accounts = accounts.filter(x => x.id !== idFromUrl());
      if (isBrowser) localStorage.setItem(accountsKey, JSON.stringify(accounts));
      return ok();
    }

    function getRoomTypes() {
      return ok(roomTypes);
    }
    
    function updateRoomType() {
      const id = parseInt(url.split('/').pop() || '');
      const params = body;
      const roomType = roomTypes.find(rt => rt.id === id);
      if (!roomType) return error('Room type not found');
      Object.assign(roomType, params);
      if (isBrowser) localStorage.setItem(roomTypesKey, JSON.stringify(roomTypes));
      return ok(roomType);
    }

    function createBooking() {
      const bookingData = body;

      const reservationFee = RESERVATION_FEES[0]?.fee || 50;

      if (!bookingData.payment || bookingData.payment.amount < reservationFee) {
        return error(`Payment amount must be at least $${reservationFee}.`);
      }

      const roomsCount = bookingData.roomsCount || 1;
      const availableRooms = rooms.filter(
        r => r.room_type_id === bookingData.roomTypeId && r.status === true
      );

      if (availableRooms.length < roomsCount) {
        return error('Not enough available rooms for selected type.');
      }

      const newBookings: Booking[] = [];

      for (let i = 0; i < roomsCount; i++) {
        const randomIndex = Math.floor(Math.random() * availableRooms.length);
        const selectedRoom = availableRooms[randomIndex];
        availableRooms.splice(randomIndex, 1);

        selectedRoom.status = false;

        let currentUser = null;
          if (isBrowser) {
            try {
              currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            } catch (e) {
              currentUser = null;
            }
          }

        const payStatus = currentUser?.role === 'frontdeskUser' ? true : false;
        const newBooking: Booking = {
          id: bookings.length + 1 + i,
          room_id: selectedRoom.id,
          guest: bookingData.guest,
          availability: bookingData.availability,
          pay_status: payStatus, 
          paidamount: bookingData.payment.amount,
          room: selectedRoom,
          requests: bookingData.requests || '',
        };

        bookings.push(newBooking);
        newBookings.push(newBooking);
      }

      if (isBrowser) {
        localStorage.setItem(roomsKey, JSON.stringify(rooms));
        localStorage.setItem(bookingsKey, JSON.stringify(bookings));
      }

      return ok(newBookings);
    }




    function getRooms() {
        let storedRooms = JSON.parse(localStorage.getItem('fake-rooms') || '[]');
        // Re-link RoomType from roomTypes
        storedRooms = storedRooms.map((r: Room) => ({
            ...r,
            RoomType: roomTypes.find((rt: RoomType) => rt.id === r.room_type_id)
        }));
        return ok(storedRooms);
    }


    function getBookings() {
      const updatedBookings = bookings.map(b => {
        const room = rooms.find(r => r.id === b.room_id);
        return { ...b, room };
      });
      return ok(updatedBookings);
    }

    function updateBooking() {
        const id = parseInt(url.split('/').pop() || '');
        const params = body;
        const booking = bookings.find(b => b.id === id);
        if (!booking) return error('Booking not found');

        Object.assign(booking, params);
        if (isBrowser) localStorage.setItem(bookingsKey, JSON.stringify(bookings));
        return ok(booking);
    }

    function deleteBooking() {
        const id = parseInt(url.split('/').pop() || '');

        const booking = bookings.find(b => b.id === id);
        if (!booking) return error('Booking not found');

        const room = rooms.find(r => r.id === booking.room_id);
        if (room) {
            room.status = true; 
        }

        bookings = bookings.filter(b => b.id !== id);

        if (isBrowser) {
            localStorage.setItem(bookingsKey, JSON.stringify(bookings));
            localStorage.setItem(roomsKey, JSON.stringify(rooms)); 
        }

        return ok();
    }


    function ok(body?: any) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function error(message: string) {
      return throwError(() => ({ status: 400, error: { message } }));
    }

    function unauthorized() {
      return throwError(() => ({ status: 401, error: { message: 'Unauthorized' } }));
    }

    function isLoggedIn() {
      return headers.get('Authorization')?.startsWith('Bearer fake-jwt-token');
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return urlParts[urlParts.length - 1];
    }

    function resetData() {
      // Clear bookings
      bookings = [];

      // Reset room status to available (true)
      rooms.forEach(r => r.status = true);

      // Save the cleared data back to localStorage
      if (isBrowser) {
        localStorage.setItem(bookingsKey, JSON.stringify(bookings));
        localStorage.setItem(roomsKey, JSON.stringify(rooms));
      }

      return ok({ message: 'Fake backend data has been reset.' });
    }

  }
}

export const fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
