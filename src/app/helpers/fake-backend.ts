import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';

// import { LocalDatabase } from '../services/local_database.service';



@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    // constructor(private db: LocalDatabase) {
    // }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;
        // var db = this.db;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            // switch (true) {
            //     case url.endsWith('/users/authenticate') && method === 'POST':
            //         return authenticate();
            //     case url.endsWith('/users/register') && method === 'POST':
            //         return register();
            //     case url.endsWith('/users') && method === 'GET':
            //         return getUsers();
            //     case url.match(/\/users\/\d+$/) && method === 'DELETE':
            //         return deleteUser();
            //     default:
            //         // pass through any requests not handled above
            //         return next.handle(request);
            // }
            return ok();
        }

        // route functions

        // function authenticate() {
        //     const { username, password } = body;
        //     const user = db.findUser(username);
        //     if (!user || user.password !== password) return error('Username or password is incorrect');
        //     return ok({
        //         id: user.id,
        //         username: user.username,
        //         firstName: user.firstName,
        //         lastName: user.lastName,
        //         admin: user.admin,
        //     })
        // }

        // function register() {
        //     const user = body

        //     if (db.findUser(user.username)) {
        //         return error('Username "' + user.username + '" is already taken')
        //     }
        //     return ok(db.insertUser(user));
        // }

        // function getUsers() {
        //     // if (!isLoggedIn()) return unauthorized();
        //     return ok(db.getAllUsers());
        // }

        // function deleteUser() {
        //     const user = body;
        //     if (!isLoggedIn()) return unauthorized();

        //     return ok(db.deleteUser(user.id));
        // }

        // helper functions

        function ok(body?: {}) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message: string) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};