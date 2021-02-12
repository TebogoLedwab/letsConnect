import { Injectable } from "@angular/core";
import { Profile, Blog, Community } from "../models/data-type";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class StoreService {
  // initial default null value
  private initial_profiles: Array<Profile> = [];
  private PROFILES_STORE = new BehaviorSubject<Profile[]>(
    this.initial_profiles
  );

  private initial_blogs: Array<Blog> = [];
  private BLOGS_STORE = new BehaviorSubject<Blog[]>(this.initial_blogs);

  private initial_communities: Array<Community> = [];
  private COMMUNITIES_STORE = new BehaviorSubject<Community[]>(
    this.initial_communities
  );

  constructor() {}

  // Allows subscription to the behavior subject as an observable
  GET_PROFILES_STORE(): Observable<Profile[]> {
    return this.PROFILES_STORE.asObservable();
  }

  // Allows updating the current value of the behavior subject
  SET_PROFILE_STORE(profiles: Array<Profile>): void {
    this.PROFILES_STORE.next(profiles);
  }

  // Allows subscription to the behavior subject as an observable
  GET_BLOGS_STORE(): Observable<Blog[]> {
    console.log(this.BLOGS_STORE);

    return this.BLOGS_STORE.asObservable();
  }

  // Allows updating the current value of the behavior subject
  SET_BLOG_STORE(blogs: Array<Blog>): void {
    this.BLOGS_STORE.next(blogs);
  }

  // Allows subscription to the behavior subject as an observable
  GET_COMMUNITES_STORE(): Observable<Community[]> {
    return this.COMMUNITIES_STORE.asObservable();
  }

  // Allows updating the current value of the behavior subject
  SET_COMMUNITY_STORE(communities: Array<Community>): void {
    this.COMMUNITIES_STORE.next(communities);
  }
}
