package com.ehtesham

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class StepCounterModule(private val reactContext: ReactApplicationContext)
  : ReactContextBaseJavaModule(reactContext), SensorEventListener {

  private var sensorManager: SensorManager? = null
  private var stepSensor: Sensor? = null

  // total steps read from sensor
  private var totalSteps = 0f

  // 👇 baseline value to reset steps when you press Start
  private var initialSteps = -1f

  override fun getName() = "StepCounterNative"

  @ReactMethod
  fun startCounting() {
    // reset baseline
    initialSteps = -1f
    sensorManager = reactContext.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    stepSensor = sensorManager?.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)

    if (stepSensor == null) {
      sendEvent("StepCounterNativeError", "Step Counter sensor not available on this device")
      return
    }

    sensorManager?.registerListener(this, stepSensor, SensorManager.SENSOR_DELAY_UI)
  }

  @ReactMethod
  fun stopCounting() {
    sensorManager?.unregisterListener(this)
  }

  override fun onSensorChanged(event: SensorEvent?) {
    if (event?.sensor?.type == Sensor.TYPE_STEP_COUNTER) {
      val currentSteps = event.values[0]

      // First reading → set baseline
      if (initialSteps < 0) {
        initialSteps = currentSteps
      }

      // Steps since start button pressed
      val stepsSinceStart = currentSteps - initialSteps

      sendEvent("StepCounterNativeUpdate", stepsSinceStart)
    }
  }

  override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

  private fun sendEvent(eventName: String, data: Any) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, data)
  }
}
