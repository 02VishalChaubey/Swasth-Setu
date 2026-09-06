import unittest
import sys
import os

# Ensure app package is on path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.triage_engine import TriageEngine
from app.models.schemas import TriageRequest, VitalSignsInput

class TestTriageEngine(unittest.TestCase):
    def setUp(self):
        self.engine = TriageEngine()

    def test_emergency_chest_pain(self):
        req = TriageRequest(
            symptoms=["chest pain", "sweating", "left arm tingling"],
            severity=8,
            duration="45 minutes",
            age=52
        )
        res = self.engine.evaluate(req)
        self.assertEqual(res.priority, "EMERGENCY")
        self.assertEqual(res.route, "108")
        self.assertGreaterEqual(res.score, 90)
        self.assertIn("EMERGENCY", res.matched_rules[0])
        self.assertIn("This is a triage aid and not a medical diagnosis", res.disclaimer)

    def test_emergency_snake_bite(self):
        req = TriageRequest(
            symptoms=["snake bite on ankle"],
            severity=5,
            duration="15 minutes",
            age=30
        )
        res = self.engine.evaluate(req)
        self.assertEqual(res.priority, "EMERGENCY")
        self.assertEqual(res.route, "108")
        self.assertTrue(res.red_flag_alert)

    def test_urgent_high_fever(self):
        req = TriageRequest(
            symptoms=["high fever", "chills and rigors", "severe body ache"],
            severity=6,
            duration="3 days",
            age=28
        )
        res = self.engine.evaluate(req)
        self.assertEqual(res.priority, "URGENT")
        self.assertIn(res.route, ["PHC_VISIT", "HOSPITAL_EMERGENCY"])
        self.assertGreaterEqual(res.score, 60)

    def test_routine_mild_cold(self):
        req = TriageRequest(
            symptoms=["mild runny nose", "sneezing"],
            severity=2,
            duration="1 day",
            age=24
        )
        res = self.engine.evaluate(req)
        self.assertEqual(res.priority, "ROUTINE")
        self.assertEqual(res.route, "PHC_VISIT")
        self.assertLess(res.score, 50)
        self.assertFalse(res.red_flag_alert)

if __name__ == '__main__':
    unittest.main()
