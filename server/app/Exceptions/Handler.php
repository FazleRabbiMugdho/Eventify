<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $exception)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            $status = 500;
            $response = [
                'success' => false,
                'message' => $exception->getMessage() ?: 'An unexpected error occurred.'
            ];

            if ($exception instanceof ValidationException) {
                $status = 422;
                // Get the first error message to be used as the top-level message
                $errors = $exception->errors();
                $firstError = collect($errors)->flatten()->first();
                $response['message'] = $firstError ?: 'The given data was invalid.';
                $response['errors'] = $errors;
            } elseif ($exception instanceof ModelNotFoundException) {
                $status = 404;
                $response['message'] = 'Resource not found.';
            } elseif ($exception instanceof HttpException) {
                $status = $exception->getStatusCode();
            }

            return response()->json($response, $status);
        }

        return parent::render($request, $exception);
    }
}
