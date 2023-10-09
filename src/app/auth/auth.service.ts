import { Injectable, OnDestroy } from '@angular/core'
import { NavController } from '@ionic/angular'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, from } from 'rxjs'
import { tap, map } from 'rxjs/operators'

import { UserModal } from './user.modal'

import { environment } from './../../environments/environment'
import { Preferences } from '@capacitor/preferences'

export interface AuthResponse {
	idToken: string
	email: string
	refreshToken: string
	expiresIn: string
	localId: string
	registered?: boolean
}

interface UserStorageData {
	id
	email
	tokken
	expireIn
}

@Injectable({
	providedIn: 'root',
})
export class AuthService implements OnDestroy {
	private _user = new BehaviorSubject<UserModal>(null)
	private _isUserAutheticated: boolean = false
	private autoLogoutTimer: any
	// private _isUserAutheticated: boolean = false;

	private _userID: string = null

	constructor(private _navCtl: NavController, private _http: HttpClient) {}

	get isUserLoggedIn() {
		return this._isUserAutheticated
	}

	get UserID() {
		return this._userID
	}

	signup(email: string, password: string) {
		return this._http
			.post<AuthResponse>(
				`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
				{ email, password, returnSecureToken: true }
			)
			.pipe(tap(this.setUserData.bind(this)))
	}

	get userTokken() {
		return this._user.asObservable().pipe(
			map((user) => {
				if (!!user) {
					return user.tokken
				} else {
					return null
				}
			})
		)
	}

	signin(email: string, password: string) {
		return this._http
			.post<AuthResponse>(
				`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
				{ email, password, returnSecureToken: true }
			)
			.pipe(tap(this.setUserData.bind(this)))
	}

	logout() {
		Preferences.remove({ key: 'userData' })
			.then(() => {
				this._isUserAutheticated = false
				this._userID = null
				this._user.next(null)
				this._navCtl.navigateRoot('/auth')
			})
			.catch((err) => console.error(err))
	}

	setUserData(userData: AuthResponse) {
		const expireTime = new Date(
			new Date().getTime() + +userData.expiresIn * 1000
		)
		let newUserData = new UserModal(
			userData.localId,
			userData.email,
			userData.idToken,
			expireTime
		)
		this._userID = userData.localId
		this._user.next(newUserData)
		let userStoreData: UserStorageData = {
			id: userData.localId,
			email: userData.email,
			tokken: userData.idToken,
			expireIn: expireTime.toISOString(),
		}
		this.storeUserData(userStoreData)
		this.autoLogout(newUserData.tokkenDuration)
	}

	getUserData() {
		return this._user
	}

	storeUserData(userResponse: UserStorageData) {
		const userStringData = JSON.stringify(userResponse)
		Preferences.set({ key: 'userData', value: userStringData })
			.then()
			.catch((err) => console.error(err))
	}

	autoLogin() {
		return from(Preferences.get({ key: 'userData' })).pipe(
			map((userStorageDataRes) => {
				if (!userStorageDataRes || !userStorageDataRes.value) {
					return false
				} else {
					let data = JSON.parse(userStorageDataRes.value)
					let expirationTime = new Date(data.expireIn)
					if (!expirationTime || expirationTime <= new Date()) {
						return false
					} else {
						let userModal = new UserModal(
							data.id,
							data.email,
							data.tokken,
							expirationTime
						)
						return userModal
					}
				}
			}),
			tap((user: any) => {
				if (!user) {
					return false
				} else {
					this._user.next(user)
					this._userID = user.id
					this._isUserAutheticated = true
					this.autoLogout(user.tokkenDuration)
				}
			})
		)
	}

	autoLogout(duration: number) {
		this.autoLogoutTimer = setTimeout(() => {
			this.logout()
		}, duration)
	}

	ngOnDestroy(): void {
		if (this.autoLogoutTimer) {
			clearTimeout(this.autoLogoutTimer)
		}
	}
}
