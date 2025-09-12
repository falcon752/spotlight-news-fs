<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Yabacon\Paystack;

class PaymentController extends Controller
{
    /**
     * Redirect to Paystack Payment Gateway
     */
    public function redirectToGateway(Request $request)
    {
        $request->validate([
            'email'  => 'required|email',
            'amount' => 'required|numeric|min:100',
        ]);

        $paystack = new Paystack(env('PAYSTACK_SECRET_KEY'));

        try {
            $tranx = $paystack->transaction->initialize([
                'amount'       => $request->amount * 100, // convert to kobo
                'email'        => $request->email,
                'callback_url' => route('payment.callback'),
            ]);

            // Return clean JSON for React
            return response()->json([
                'status'            => true,
                'message'           => 'Payment initialized',
                'authorization_url' => $tranx->data->authorization_url,
                'access_code'       => $tranx->data->access_code,
                'reference'         => $tranx->data->reference,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Error initializing payment: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handle Paystack Callback
     */
    public function handleGatewayCallback()
    {
        $paystack = new Paystack(env('PAYSTACK_SECRET_KEY'));

        try {
            $paymentDetails = $paystack->transaction->verify([
                'reference' => request()->reference,
            ]);

            if ($paymentDetails->data->status === 'success') {
                // Store transaction details here if needed
                return redirect('/')->with('success', 'Payment successful!');
            } else {
                return redirect('/')->with('error', 'Payment failed or was canceled.');
            }
        } catch (\Exception $e) {
            return redirect('/')->with('error', 'Error verifying transaction: ' . $e->getMessage());
        }
    }
}
