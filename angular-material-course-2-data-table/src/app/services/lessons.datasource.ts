
import {DataSource, CollectionViewer} from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Lesson } from '../model/lesson';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from './courses.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

export class LessonsDataSource implements DataSource<Lesson> {

    private lessonsSubject = new BehaviorSubject<Lesson[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private courseService: CoursesService) {
    }

    connect(collectionViewer: CollectionViewer): Observable<Lesson[]> {
        return this.lessonsSubject.asObservable();
    }

    loadLessons(courseId: number, filter: string, sortDirection: string, pageIndex: number, pageSize: number ) {

        this.loadingSubject.next(true);

        this.courseService.findLessons(courseId, filter, sortDirection, pageIndex, pageSize)
            .pipe(catchError(() => of([])), finalize(() => this.loadingSubject.next(false)))
            .subscribe(lessons => this.lessonsSubject.next(lessons));
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.lessonsSubject.complete();
    }
}
