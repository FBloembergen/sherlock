import { Derivable, Reactor, ReactorOptions } from '@politie/sherlock';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

// Adds the toObservable method to Derivable.
declare module '@politie/sherlock/derivable/derivable' {
    // tslint:disable-next-line:no-shadowed-variable
    export interface Derivable<V> {
        /**
         * Create an RxJS Observable from this Derivable. The Observable stream can be tweaked with the same options that
         * can also be used with {@link Derivable#react}.
         *
         * @param options optional options that indicate how to transform the Derivable into an Observable stream
         */
        toObservable(options?: Partial<ReactorOptions<V>>): Observable<V>;
    }
}

Derivable.prototype.toObservable = function toObservable<V>(this: Derivable<V>, options?: Partial<ReactorOptions<V>>) {
    return new Observable<V>((subscriber: Subscriber<V>) => {
        return Reactor.create(this,
            // onValue: notify subscriber
            value => subscriber.next(value),
            // Merge the options with the default options.
            options,
            // onComplete: notify subscriber unless explicitly unsubscribed
            () => subscriber.closed || subscriber.complete(),
        );
    });
};
