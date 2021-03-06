import _Vue from 'vue';

import './vue';

export interface HttpHeaders {
    put?: { [key: string]: string };
    post?: { [key: string]: string };
    patch?: { [key: string]: string };
    delete?: { [key: string]: string };
    common?: { [key: string]: string };
    custom?: { [key: string]: string };
    [key: string]: any;
}

export interface HttpResponse {
    data: any;
    ok: boolean;
    status: number;
    statusText: string;
    headers: Function;
    body: any;
    bodyText: string;
    text(): string;
    json(): any;
    blob(): Blob;
}

export interface HttpOptions {
    url?: string;
    method?: string;
    body?: any;
    params?: any;
    headers?: any;
    before?(request: any): any;
    progress?(event: any): any;
    credentials?: boolean;
    emulateHTTP?: boolean;
    emulateJSON?: boolean;
}

export interface $http { // eslint-disable-line @typescript-eslint/class-name-casing
    (url: string, data?: any, options?: HttpOptions): PromiseLike<HttpResponse>;
    (url: string, options?: HttpOptions): PromiseLike<HttpResponse>;
}

export interface HttpInterceptor {
    request?(request: HttpOptions): HttpOptions;
    response?(response: HttpResponse): HttpResponse;
}

export interface Http {
    options: HttpOptions & { root: string };
    headers: HttpHeaders;
    interceptors: (HttpInterceptor | Function)[];
    get: $http;
    post: $http;
    put: $http;
    patch: $http;
    delete: $http;
    jsonp: $http;
}

export interface ResourceActions {
    get: { method: string };
    save: { method: string };
    query: { method: string };
    update: { method: string };
    remove: { method: string };
    delete: { method: string };
}

export interface ResourceMethod {
    (params: any, data?: any, success?: Function, error?: Function): PromiseLike<HttpResponse>;
    (params: any, success?: Function, error?: Function): PromiseLike<HttpResponse>;
    (success?: Function, error?: Function): PromiseLike<HttpResponse>;
}

export interface ResourceMethods {
    get: ResourceMethod;
    save: ResourceMethod;
    query: ResourceMethod;
    update: ResourceMethod;
    remove: ResourceMethod;
    delete: ResourceMethod;
}

export interface $resource { // eslint-disable-line @typescript-eslint/class-name-casing
    (url: string, params?: any, actions?: any, options?: HttpOptions): ResourceMethods;
}

export interface Resource extends $resource {
    actions: ResourceActions;
}

export declare function install(vue: typeof _Vue): void;
