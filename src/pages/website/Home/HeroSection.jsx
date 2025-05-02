import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import backgroundImage from "../../../assets/Garbage_truck_arriving.png"; // Ensure correct path

export default function HeroPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <section className="relative bg-gradient-to-b from-green-100 to-white min-h-[130] flex flex-col justify-center pb-0">
      <div className="flex flex-col lg:flex-row w-full max-w-7xl mx-auto px-4 lg:px-8 pt-5 md:pt-8">
        {/* Left Side: Image */}
        <Box className="lg:w-1/2 w-full flex justify-center items-center mb-6 lg:mb-0">
          <img
            src={backgroundImage}
            alt="Recycling Truck"
            className="w-full max-w-[320px] md:max-w-md lg:max-w-lg object-contain"
          />
        </Box>

        {/* Right Side: Content */}
        <Box className="lg:w-1/2 w-full flex flex-col justify-center text-center px-2 space-y-4">
          <h2 className="text-green-700 font-bold leading-tight text-[2rem] sm:text-[2.5rem] md:text-[4rem]">
            Utilize <span className="text-[#f2c438]">Wasteology!</span>
          </h2>

          <h3 className="text-gray-500 font-semibold text-[1.25rem] sm:text-[1.75rem] md:text-[2.5rem]">
            Your Online Kabadiwala.
          </h3>

          {!isMobile && (
            <>
              <div className="px-2 sm:px-6">
                <h4 className="text-green-700 font-semibold text-lg sm:text-xl md:text-2xl">
                  Turn your waste into wealth!
                </h4>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
                  Wasteology makes recycling hassle-free by offering the best
                  value for your scrap, all while ensuring responsible and
                  sustainable practices.
                  {/* ♻️💰🌱 */}
                </p>
              </div>

              <Link to="/scrap-rates" className="mt-2">
                <Button
                  variant="outlined"
                  color="success"
                  size="large"
                  sx={{
                    borderRadius: 50,
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    textTransform: "none",
                    boxShadow: 3,
                    "&:hover": {
                      boxShadow: 5,
                    },
                  }}
                >
                  ♻ Check Our Latest Scrap Rate!
                </Button>
              </Link>
            </>
          )}
        </Box>
      </div>
    </section>
  );
}
