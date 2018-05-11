
import {DataSource, CollectionViewer} from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Lesson } from '../model/lesson';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from './courses.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

export class LessonsDataSource implements DataSource<Lesson> {

    private lessonsSubject = new BehaviorSubject<Lesson[]>([]);

    constructor(private courseService: CoursesService) {
    }

    connect(collectionViewer: CollectionViewer): Observable<Lesson[]> {
        return this.lessonsSubject.asObservable();
    }

    loadLessons(courseId: number, filter: string, sortDirection: string, pageIndex: number, pageSize: number ) {
        this.courseService.findLessons(courseId, filter, sortDirection, pageIndex, pageSize)
            .pipe(catchError(() => of([])))
            .subscribe(lessons => this.lessonsSubject.next(lessons));
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.lessonsSubject.complete();
    }
}
